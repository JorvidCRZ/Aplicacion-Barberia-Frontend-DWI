import {
  Component,
  inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth/auth.service';
import { TokenService } from '../../../core/services/auth/token.service';
import { NotificationService } from '../../../core/services/common/notification.service';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { campoInvalido } from '@/app/shared/utils/form-utils.component';
import { environment } from '../../../../environments/environment.development';

export interface GoogleCredentialResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, FormsModule, InputTextModule, CheckboxModule,
    ButtonModule, LogoComponent, PasswordModule, MessageModule,
    RouterModule, CommonModule
  ],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoElement')
  videoElement!: ElementRef<HTMLVideoElement>;

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private notify = inject(NotificationService);

  // ── Login normal ──────────────────────────────
  formularioLogin!: FormGroup;
  loading = false;
  formSubmitted = false;
  campoInvalido = (campo: string) => campoInvalido(this.formularioLogin, campo, this.formSubmitted);

  // ── QR ───────────────────────────────────────
  qrScanned = false;
  qrToken = '';
  pin = '';
  loadingQr = false;
  scannerEnabled = false;
  pinError = '';
  private stream: MediaStream | null = null;

  ngOnInit() {
    this.initForm();
  }

  ngAfterViewInit() {
    this.initGoogleSignIn();
  }

  ngOnDestroy() {
    this.stopCamera();
  }

  initForm() {
    this.formularioLogin = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^[^@]+$/)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [false]
    });
  }

  // ── Login normal ──────────────────────────────
  login() {
    this.formSubmitted = true;
    if (this.formularioLogin.invalid) {
      this.notify.showError('Completa correctamente el formulario');
      return;
    }
    this.loading = true;
    this.authService.login(this.formularioLogin.value)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notify.showSuccess('Bienvenido al sistema');
          this.redirectUser();
        },
        error: (err) => {
          this.notify.showHttpError(err, 'Error de autenticación');
        }
      });
  }

  // ── Google ────────────────────────────────────
  initGoogleSignIn() {
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => this.renderGoogleButton();
      document.head.appendChild(script);
    } else {
      this.renderGoogleButton();
    }
  }

  renderGoogleButton() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: this.handleGoogleCredentialResponse.bind(this)
    });
    const googleBtnContainer = document.getElementById('google-button');
    if (googleBtnContainer) {
      google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: 'filled_black', size: 'large', shape: 'rectangular', width: 400 }
      );
    }
  }

  handleGoogleCredentialResponse(response: GoogleCredentialResponse) {
    this.loading = true;
    this.authService.loginWithGoogle(response.credential)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.notify.showSuccess('Bienvenido al sistema con Google');
          this.redirectUser();
        },
        error: (err) => {
          this.notify.showHttpError(err, 'Error de autenticación con Google');
        }
      });
  }

  // ── QR Scanner ────────────────────────────────
  async activarEscaner() {
    this.cancelarQr();
    this.scannerEnabled = true;

    setTimeout(async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        const device = videoDevices[0];

        if (!device) {
          this.notify.showError('No se encontró ninguna cámara');
          this.scannerEnabled = false;
          return;
        }

        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId }
        });

        this.videoElement.nativeElement.srcObject = this.stream;
        await this.videoElement.nativeElement.play();

        this.scanQrFromVideo();

      } catch (err: any) {
        console.error(err);
        this.scannerEnabled = false;
        this.notify.showError('No se pudo iniciar la cámara. Usa HTTPS o revisa permisos.');
      }
    }, 300);
  }

 private async scanQrFromVideo() {
  const { BrowserMultiFormatReader } = await import('@zxing/browser');
  const reader = new BrowserMultiFormatReader();

  const tick = async () => {
    if (!this.scannerEnabled || this.qrScanned) return;

    try {
      const result = reader.decodeFromCanvas(this.getCanvasFromVideo());
      if (result) {
        this.onQrScanned(result.getText());
        return;
      }
    } catch (_) {}

    setTimeout(tick, 200); 
  };

  tick();
}

private getCanvasFromVideo(): HTMLCanvasElement {
  const video = this.videoElement.nativeElement;
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d')!.drawImage(video, 0, 0);
  return canvas;
}

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.scannerEnabled = false;
  }

  onQrScanned(result: string) {
    if (!result || this.qrScanned) return;
    console.log('QR TOKEN LEIDO:', result);
    this.qrToken = result;
    this.qrScanned = true;
    this.stopCamera();
  }

  loginConQr() {
    console.log('Enviando qrToken:', this.qrToken);
    console.log('Enviando pin:', this.pin);
    if (!this.pin || this.pin.length < 4) {
      this.pinError = 'Ingresa tu PIN de 4 a 6 dígitos';
      return;
    }
    this.loadingQr = true;
    this.pinError = '';
    this.authService.loginWithQr(this.qrToken, this.pin)
      .pipe(finalize(() => this.loadingQr = false))
      .subscribe({
        next: () => {
          this.notify.showSuccess('Bienvenido al sistema');
          this.redirectUser();
        },
        error: (err) => {
          this.pinError = err?.error?.message || 'QR o PIN incorrecto';
          this.qrScanned = false;
          this.qrToken = '';
        }
      });
  }

  cancelarQr() {
    this.stopCamera();
    this.qrScanned = false;
    this.qrToken = '';
    this.pin = '';
    this.pinError = '';
  }

  private redirectUser() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    const home = this.tokenService.getHomeByRole();
    this.router.navigateByUrl(returnUrl || home, { replaceUrl: true });
  }
}
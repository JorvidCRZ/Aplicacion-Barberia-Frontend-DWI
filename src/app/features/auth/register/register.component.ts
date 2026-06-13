import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { Router, RouterLink } from '@angular/router';
import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { TokenService } from '../../../core/services/auth/token.service';
import { NotificationService } from '../../../core/services/common/notification.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../../environments/environment.development';
import { finalize } from 'rxjs';

export interface GoogleCredentialResponse {
  credential: string;
  clientId: string;
  select_by: string;
}

declare var google: any;

const soloLetrasValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s'-]+$/.test(valor.trim()) ? null : { soloLetras: true };
};

const telefonoPeruanoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = (control.value ?? '').replace(/\s/g, '');
  return /^(\+?51)?9\d{8}$/.test(valor) ? null : { telefonoInvalido: true };
};

const usernameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  if (/\s/.test(valor)) return { sinEspacios: true };
  return /^[a-zA-Z0-9._]+$/.test(valor) ? null : { usernameInvalido: true };
};

const passwordSeguraValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = control.value ?? '';
  const errores: ValidationErrors = {};
  if (valor.length < 8)          errores['minLength']    = true;
  if (!/[A-Z]/.test(valor))      errores['sinMayuscula'] = true;
  if (!/[0-9]/.test(valor))      errores['sinNumero']    = true;
  if (!/[^a-zA-Z0-9]/.test(valor)) errores['sinSimbolo'] = true;
  return Object.keys(errores).length ? errores : null;
};

const passwordsIgualesValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const pwd     = group.get('password')?.value;
  const confirm = group.get('passwordConfirm')?.value;
  return pwd && confirm && pwd !== confirm ? { passwordsNoCoinciden: true } : null;
};

const gmailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor: string = (control.value ?? '').trim().toLowerCase();
  return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(valor) ? null : { gmailInvalido: true };
};


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    LogoComponent, InputTextModule, MessageModule, CheckboxModule,
    PasswordModule, ReactiveFormsModule, RouterLink, ButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent implements AfterViewInit {
  private fb          = inject(FormBuilder);
  private authService = inject(AuthService);
  private router      = inject(Router);
  private tokenService = inject(TokenService);
  private notify      = inject(NotificationService);

  errorMsg  = '';
  loading   = false;
  submitted = false;

  registerForm = this.fb.group(
    {
      nombre:          ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      apellido:        ['', [Validators.required, Validators.minLength(2), soloLetrasValidator]],
      telefono:        ['', [Validators.required, telefonoPeruanoValidator]],
      email:           ['', [ Validators.required, Validators.email, gmailValidator ]],
      username:        ['', [Validators.required, Validators.minLength(4), usernameValidator]],
      password:        ['', [Validators.required, passwordSeguraValidator]],
      passwordConfirm: ['', [Validators.required]],
      terminos:        [false, [Validators.requiredTrue]],
    },
    { validators: passwordsIgualesValidator }   
  );

  ngAfterViewInit() {
    this.initGoogleSignIn();
  }

  get passwordCtrl()        { return this.registerForm.get('password'); }
  get passwordConfirmCtrl() { return this.registerForm.get('passwordConfirm'); }

  isInvalid(campo: string): boolean {
    return campoInvalido(this.registerForm, campo, this.submitted);
  }

  get passwordError(): string {
    const e = this.passwordCtrl?.errors;
    if (!e) return '';
    if (e['minLength'])    return 'Debe tener al menos 8 caracteres';
    if (e['sinMayuscula']) return 'Debe incluir al menos una mayúscula';
    if (e['sinNumero'])    return 'Debe incluir al menos un número';
    if (e['sinSimbolo'])   return 'Debe incluir al menos un símbolo (ej. @, #, !)';
    return 'Contraseña inválida';
  }

  get confirmError(): string {
    if (this.passwordConfirmCtrl?.errors?.['required']) return 'Confirma tu contraseña';
    if (this.registerForm.errors?.['passwordsNoCoinciden'] && this.submitted) return 'Las contraseñas no coinciden';
    return '';
  }

  // REGISTRO SIN GOOGLE
  onSubmit(): void {
    this.submitted = true;
    marcarFormulario(this.registerForm);

    if (this.registerForm.invalid) return;

    const { email, password, nombre, apellido, telefono, username } = this.registerForm.value;

    const payload = {
      username: username!,
      password: password!,
      idRol:    3,
      nombre:   nombre!,
      apellido: apellido!,
      telefono: telefono!,
      email:    email!,
    };

    this.loading  = true;
    this.errorMsg = '';

    this.authService.register(payload).subscribe({
      next: () => {
        this.notify.showSuccess('Cuenta creada exitosamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const msg: string = err.error?.message ?? '';
        if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('correo')) {
          this.registerForm.get('email')?.setErrors({ emailDuplicado: true });
          this.errorMsg = 'Este correo ya está registrado. Inicia sesión o usa otro.';
        } else {
          this.errorMsg = msg || 'Error al registrarse. Intenta de nuevo.';
        }
        this.loading = false;
      },
    });
  }

  // REGISTRO CON GOOGLE 
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

    const googleBtnContainer = document.getElementById("google-register-button");
    if (googleBtnContainer) {
      google.accounts.id.renderButton(
        googleBtnContainer,
        { theme: "filled_black", size: "large", shape: "rectangular", width: "100%" }
      );
    }
  }

  handleGoogleCredentialResponse(response: GoogleCredentialResponse) {
    this.loading = true;
    this.authService.loginWithGoogle(response.credential).pipe(finalize(() => this.loading = false)).subscribe({
      next: () => {
        this.notify.showSuccess('Cuenta creada y sesión iniciada con Google');
        const home = this.tokenService.getHomeByRole();
        this.router.navigateByUrl(home, { replaceUrl: true });
      },
      error: (err) => {
        this.notify.showHttpError(err, 'Error procesando tu cuenta de Google');
      }
    });
  }
}
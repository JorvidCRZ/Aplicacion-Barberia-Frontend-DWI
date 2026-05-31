import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../../core/services/auth/auth.service';
import { TokenService } from '../../../core/services/auth/token.service';
import { NotificationService } from '../../../core/services/common/notification.service';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { campoInvalido } from '@/app/shared/utils/form-utils.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule, InputTextModule, CheckboxModule, ButtonModule, LogoComponent, PasswordModule, MessageModule
  ],
  templateUrl: './login.html',
})
export class LoginComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  private notify = inject(NotificationService);

  formularioLogin!: FormGroup;
  loading = false;
  submitted = false;
  formSubmitted = false;

  campoInvalido = (campo: string) => campoInvalido(this.formularioLogin, campo, this.formSubmitted);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formularioLogin = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      remember: [false]
    });
  }

  login() {
    this.submitted = true;
    if (this.formularioLogin.invalid) {
      this.notify.showError('Completa correctamente el formulario');
      return;
    }
    this.loading = true;
    this.authService.login(this.formularioLogin.value).pipe(finalize(() => this.loading = false)).subscribe({
      next: (res) => {
        this.notify.showSuccess('Bienvenido al sistema');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        const home = this.tokenService.getHomeByRole();
        this.router.navigate([returnUrl || home], { replaceUrl: true });
      },
      error: (err) => {
        this.notify.showHttpError(err, 'Error de autenticación');
      }
    });
  }
}
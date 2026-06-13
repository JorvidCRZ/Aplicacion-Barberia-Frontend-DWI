import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';

import { AuthService } from '@/app/core/services/auth/auth.service';
import { campoInvalido } from '@/app/shared/utils/form-utils.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, MessageModule, LogoComponent],
  templateUrl: './forgot-password.html',
})
export class ForgotPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  formulario!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';

  campoInvalido = (campo: string) => campoInvalido(this.formulario, campo, this.submitted);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.formulario.invalid) {
      this.errorMessage = 'Ingresa un correo electrónico válido.';
      return;
    }

    this.loading = true;
    const email = this.formulario.value.email;

    this.authService.forgotPassword(email).pipe(finalize(() => (this.loading = false))).subscribe({
      next: () => {
        this.successMessage = 'Si el correo existe en nuestro sistema, recibirás un enlace para recuperar tu contraseña.';
        this.formulario.reset();
        this.submitted = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo enviar la solicitud. Intenta de nuevo más tarde.';
      },
    });
  }
}

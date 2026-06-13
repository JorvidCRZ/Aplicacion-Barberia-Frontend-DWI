import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { campoInvalido } from '@/app/shared/utils/form-utils.component';
import { LogoComponent } from '@/app/shared/components/logo/logo.component';

// Validator personalizado para validar que las contraseñas coincidan
export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const nuevaPassword = control.get('nuevaPassword');
  const confirmarPassword = control.get('confirmarPassword');

  if (!nuevaPassword || !confirmarPassword) {
    return null;
  }

  return nuevaPassword.value === confirmarPassword.value ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, InputTextModule, ButtonModule, MessageModule, LogoComponent],
  templateUrl: './reset-password.html',
  styleUrls: ['./reset-password.css'],
})
export class ResetPassword implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  formulario!: FormGroup;
  loading = false;
  submitted = false;
  successMessage = '';
  errorMessage = '';
  token: string | null = null;

  campoInvalido = (campo: string) => campoInvalido(this.formulario, campo, this.submitted);

  ngOnInit() {
    this.readToken();
    this.initForm();
  }

  readToken() {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      
      if (!this.token) {
        this.errorMessage = 'Token no válido. Redirigiendo a recuperar contraseña...';
        setTimeout(() => {
          this.router.navigate(['/forgot-password']);
        }, 2000);
      }
    });
  }

  initForm() {
    this.formulario = this.fb.group(
      {
        nuevaPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator }
    );
  }

  getPasswordMismatchError(): boolean {
    return !!(
      this.formulario.hasError('passwordMismatch') &&
      this.submitted &&
      this.formulario.get('confirmarPassword')?.touched
    );
  }

  submit() {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Token no disponible. Por favor, intenta de nuevo.';
      return;
    }

    if (this.formulario.invalid) {
      if (this.getPasswordMismatchError()) {
        this.errorMessage = 'Las contraseñas no coinciden.';
      } else {
        this.errorMessage = 'Por favor, completa el formulario correctamente.';
      }
      return;
    }

    this.loading = true;
    const nuevaPassword = this.formulario.get('nuevaPassword')?.value;

    this.authService
      .resetPassword(this.token, nuevaPassword)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.successMessage = '¡Contraseña actualizada correctamente! Redirigiendo a login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (err) => {
          console.error('Error resetting password:', err);
          this.errorMessage =
            err?.error?.message || 'Error al actualizar la contraseña. Por favor, intenta de nuevo.';
        },
      });
  }
}



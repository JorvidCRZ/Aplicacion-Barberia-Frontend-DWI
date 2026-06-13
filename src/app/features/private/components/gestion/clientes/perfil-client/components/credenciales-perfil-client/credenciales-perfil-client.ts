import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ResetPasswordRequest } from '@/app/core/models/auth/usuario/reset-password-request.model';
import { UpdateUsernameRequest } from '@/app/core/models/auth/usuario/update-username-request.model';

@Component({
  selector: 'app-credenciales-perfil-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credenciales-perfil-client.html',
  styleUrl: './credenciales-perfil-client.css',
})
export class CredencialesPerfilClient {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notification = inject(NotificationService);

  @Input() usuario: string = 'null';
  @Input() contrasena: string = 'null';
  @Input() idUsuario: number = 0;
  @Output() passwordReset = new EventEmitter<void>();
  @Output() usernameUpdate = new EventEmitter<void>();

  showResetModal = false;
  showEditUsernameModal = false;
  isSubmitting = false;
  showNewPassword = false;
  showConfirmPassword = false;

  form = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  });

  usernameForm = this.fb.group({
    username: [
      '',
      [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(50)
      ]
    ],
  });

  get f() {
    return this.form.controls;
  }

  get uf() {
    return this.usernameForm.controls;
  }

  openResetModal(): void {
    this.form.reset();
    this.form.setErrors(null);
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
    this.isSubmitting = false;
    this.form.reset();
  }

  onResetPassword(): void {
    this.openResetModal();
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  confirmResetPassword(): void {
    if (!this.idUsuario) {
      this.notification.showWarn('No se pudo identificar el usuario asociado al cliente.');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newPassword = this.f.newPassword.value?.trim() ?? '';
    const confirmPassword = this.f.confirmPassword.value?.trim() ?? '';

    if (newPassword !== confirmPassword) {
      this.f.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    this.isSubmitting = true;

    const payload: ResetPasswordRequest = {
      newPassword,
    };

    this.usuarioService.resetPassword(this.idUsuario, payload).subscribe({
      next: (response) => {
        this.notification.showSuccess(response?.message || 'Contraseña restablecida correctamente');
        this.closeResetModal();
        this.passwordReset.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Resetear contraseña');
      },
    });
  }

  openEditUsernameModal(): void {
    this.usernameForm.reset({ username: this.usuario });
    this.usernameForm.setErrors(null);
    this.showEditUsernameModal = true;
  }

  closeEditUsernameModal(): void {
    this.showEditUsernameModal = false;
    this.isSubmitting = false;
    this.usernameForm.reset();
  }

  confirmUpdateUsername(): void {
    if (!this.idUsuario) {
      this.notification.showWarn('No se pudo identificar el usuario asociado al cliente.');
      return;
    }

    if (this.usernameForm.invalid) {
      this.usernameForm.markAllAsTouched();
      return;
    }

    const newUsername = this.uf.username.value?.trim() ?? '';

    if (!newUsername) {
      this.notification.showWarn(
        'El nombre de usuario es obligatorio.'
      );
      return;
    }

    if (newUsername.length < 4 || newUsername.length > 50) {
      this.notification.showWarn(
        'El nombre de usuario debe tener entre 4 y 50 caracteres.'
      );
      return;
    }

    if (newUsername === this.usuario) {
      this.notification.showWarn('El nuevo nombre de usuario es igual al actual.');
      return;
    }

    this.isSubmitting = true;

    const payload: UpdateUsernameRequest = {
      username: newUsername,
    };

    this.usuarioService.updateUsername(this.idUsuario, payload).subscribe({
      next: (response) => {
        this.notification.showSuccess(response?.message || 'Nombre de usuario actualizado correctamente');
        this.closeEditUsernameModal();
        this.usernameUpdate.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Actualizar nombre de usuario');
      },
    });
  }
}

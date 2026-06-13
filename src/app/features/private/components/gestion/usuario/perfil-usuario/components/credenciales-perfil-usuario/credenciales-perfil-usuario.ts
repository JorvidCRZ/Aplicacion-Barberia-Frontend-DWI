import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ResetPasswordRequest } from '@/app/core/models/auth/usuario/reset-password-request.model';
import { UpdateUsernameRequest } from '@/app/core/models/auth/usuario/update-username-request.model';

@Component({
  selector: 'app-credenciales-perfil-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './credenciales-perfil-usuario.html',
  styleUrl: './credenciales-perfil-usuario.css',
})
export class CredencialesPerfilUsuario implements OnInit, OnChanges, OnDestroy {

  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private notification = inject(NotificationService);

  @Input() usuario: string = 'No disponible';
  contrasena: string = 'No disponible';
  @Input() idUsuario: number = 0;

  /** URL de la imagen QR (base64 o URL). Si es null, el usuario no tiene QR. */
  @Input() qrImageUrl: string | null = null;

  @Output() passwordReset = new EventEmitter<void>();
  @Output() usernameUpdate = new EventEmitter<void>();
  @Output() qrGenerated = new EventEmitter<string>(); // emite la nueva URL del QR

  // ── Estado modales ────────────────────────────────────────────────────────
  showResetModal = false;
  showEditUsernameModal = false;
  showQrModal = false;

  // ── Estado general ────────────────────────────────────────────────────────
  isSubmitting = false;
  isGeneratingQr = false;

  showNewPassword = false;
  showConfirmPassword = false;

  loadingCredentials = false;
  private qrObjectUrl: string | null = null;

  // ── Formularios ───────────────────────────────────────────────────────────
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

  get f() { return this.form.controls; }
  get uf() { return this.usernameForm.controls; }

  ngOnInit(): void {
    this.cargarCredenciales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idUsuario'] && !changes['idUsuario'].firstChange) {
      this.cargarCredenciales();
    }
  }

  ngOnDestroy(): void {
    this.revokeQrObjectUrl();
  }

  private cargarCredenciales(): void {
    if (!this.idUsuario || this.idUsuario <= 0) {
      return;
    }

    this.loadingCredentials = true;

    this.usuarioService.obtenerPorId(this.idUsuario).subscribe({
      next: (response) => {
        const data: any = response?.data ?? {};
        const persona = data?.persona ?? {};
        const usuario = persona?.usuario ?? data?.usuario ?? data?.account ?? data?.credenciales ?? {};

        console.debug('[CredencialesPerfilUsuario] respuesta obtenerPorId', {
          idUsuario: this.idUsuario,
          response,
          data,
          persona,
          usuario,
        });

        const username = usuario?.user
          ?? usuario?.username
          ?? usuario?.nombreUsuario
          ?? usuario?.nombre_usuario
          ?? usuario?.login
          ?? data?.user
          ?? data?.username
          ?? data?.nombreUsuario
          ?? data?.nombre_usuario
          ?? data?.login
          ?? persona?.usuario?.user
          ?? persona?.usuario?.username
          ?? persona?.usuario?.nombreUsuario
          ?? persona?.usuario?.login
          ?? this.usuario;

        this.usuario = String(username || 'No disponible');

        const rawPassword = usuario?.password
          ?? usuario?.contrasena
          ?? usuario?.clave
          ?? data?.password
          ?? data?.contrasena
          ?? data?.clave
          ?? persona?.usuario?.password
          ?? persona?.usuario?.contrasena
          ?? persona?.usuario?.clave
          ?? null;

        if (rawPassword) {
          this.contrasena = this.maskPassword(String(rawPassword));
        }

        if (data?.tieneQr) {

          this.usuarioService.generateQr(this.idUsuario)
            .subscribe(blob => {

              this.revokeQrObjectUrl();

              this.qrObjectUrl =
                URL.createObjectURL(blob);

              this.qrImageUrl =
                this.qrObjectUrl;
            });

        }
        else {
          this.qrImageUrl = null;
        }
        this.loadingCredentials = false;
      },
      error: () => {
        this.loadingCredentials = false;
      },
    });
  }

  // ─── Reset contraseña ─────────────────────────────────────────────────────

  openResetModal(): void {
    this.form.reset();
    this.showNewPassword = false;
    this.showConfirmPassword = false;
    this.form.setErrors(null);
    this.showResetModal = true;
  }

  closeResetModal(): void {
    this.showResetModal = false;
    this.isSubmitting = false;
    this.form.reset();
  }

  toggleNewPassword(): void { this.showNewPassword = !this.showNewPassword; }
  toggleConfirmPassword(): void { this.showConfirmPassword = !this.showConfirmPassword; }

  confirmResetPassword(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    const newPassword = this.f.newPassword.value?.trim() ?? '';

    if (newPassword.length < 8) {
      this.notification.showWarn(
        'La contraseña debe tener mínimo 8 caracteres.'
      );
      return;
    }

    const confirmPassword = this.f.confirmPassword.value?.trim() ?? '';

    if (newPassword !== confirmPassword) {
      this.f.confirmPassword.setErrors({ mismatch: true });
      return;
    }

    this.isSubmitting = true;
    const payload: ResetPasswordRequest = { newPassword };

    this.usuarioService.resetPassword(this.idUsuario, payload).subscribe({
      next: (res) => {
        this.notification.showSuccess(res?.message || 'Contraseña restablecida correctamente');
        this.closeResetModal();
        this.passwordReset.emit();
        this.cargarCredenciales();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Resetear contraseña');
      },
    });
  }

  // ─── Editar usuario ───────────────────────────────────────────────────────

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
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }
    if (this.usernameForm.invalid) { this.usernameForm.markAllAsTouched(); return; }

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
    const payload: UpdateUsernameRequest = { username: newUsername };

    this.usuarioService.updateUsername(this.idUsuario, payload).subscribe({
      next: (res) => {
        this.usuario = newUsername;
        this.notification.showSuccess(res?.message || 'Nombre de usuario actualizado correctamente');
        this.closeEditUsernameModal();
        this.usernameUpdate.emit();
        this.cargarCredenciales();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.notification.showHttpError(err, 'Actualizar nombre de usuario');
      },
    });
  }

  // ─── QR ──────────────────────────────────────────────────────────────────

  openGenerateQrModal(): void {
    this.showQrModal = true;
  }

  openRegenerateQrModal(): void {
    this.showQrModal = true;
  }

  closeQrModal(): void {
    this.showQrModal = false;
    this.isGeneratingQr = false;
  }

  confirmGenerateQr(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }

    this.isGeneratingQr = true;

    this.usuarioService.regenerarQr(this.idUsuario).subscribe({
      next: (blob) => {
        if (!(blob instanceof Blob)) {
          this.notification.showWarn('No se pudo generar el QR.');
          this.isGeneratingQr = false;
          return;
        }

        this.revokeQrObjectUrl();

        this.qrObjectUrl = URL.createObjectURL(blob);
        this.qrImageUrl = this.qrObjectUrl;
        this.isGeneratingQr = false;
        this.notification.showSuccess('Código QR generado correctamente');
        this.closeQrModal();
        this.qrGenerated.emit(this.qrImageUrl);
      },
      error: (err) => {
        this.isGeneratingQr = false;
        this.notification.showHttpError(err, 'Generar QR');
      },
    });
  }

  private maskPassword(password: string): string {
    if (!password) return 'No disponible';
    if (password.length <= 4) return password;
    const maskedLength = Math.min(Math.max(password.length - 4, 8), 16);
    return `${'•'.repeat(maskedLength)}${password.slice(-4)}`;
  }

  private revokeQrObjectUrl(): void {
    if (this.qrObjectUrl) {
      URL.revokeObjectURL(this.qrObjectUrl);
      this.qrObjectUrl = null;
    }
  }

  // Propiedades nuevas
showPinModal = false;
isSubmittingPin = false;
showPinValue = false;

pinForm = this.fb.group({
    pin: ['', [
        Validators.required,
        Validators.pattern(/^\d{4,6}$/)
    ]]
});

get pf() { return this.pinForm.controls; }

openPinModal(): void {
    this.pinForm.reset();
    this.showPinModal = true;
}

closePinModal(): void {
    this.showPinModal = false;
    this.isSubmittingPin = false;
    this.pinForm.reset();
}

togglePinValue(): void { this.showPinValue = !this.showPinValue; }

confirmAsignarPin(): void {
    if (!this.idUsuario) { this.notification.showWarn('No se pudo identificar el usuario.'); return; }
    if (this.pinForm.invalid) { this.pinForm.markAllAsTouched(); return; }

    const pin = this.pf.pin.value?.trim() ?? '';
    this.isSubmittingPin = true;

    this.usuarioService.asignarPin(this.idUsuario, pin).subscribe({
        next: () => {
            this.notification.showSuccess('PIN asignado correctamente');
            this.closePinModal();
        },
        error: (err) => {
            this.isSubmittingPin = false;
            this.notification.showHttpError(err, 'Asignar PIN');
        }
    });
}
}
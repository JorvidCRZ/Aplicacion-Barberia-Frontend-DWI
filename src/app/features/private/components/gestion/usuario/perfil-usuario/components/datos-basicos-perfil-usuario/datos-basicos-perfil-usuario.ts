import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '@/app/core/services/gestion/persona.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  selector: 'app-datos-basicos-perfil-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-basicos-perfil-usuario.html',
  styleUrl: './datos-basicos-perfil-usuario.css',
})
export class DatosBasicosPerfilUsuario implements OnInit {

  @Input() usuarioId!: number;
  @Input() personaId!: number;

  @Input() nombre   = '—';
  @Input() apellido = '—';
  @Input() telefono = '—';
  @Input() email    = '—';

  private personaService      = inject(PersonaService);
  private notificationService = inject(NotificationService);

  editando  = false;
  guardando = false;

  form = {
    nombre:   '',
    apellido: '',
    telefono: '',
    email:    '',
  };

  ngOnInit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      nombre:   this.nombre   === '—' ? '' : this.nombre,
      apellido: this.apellido === '—' ? '' : this.apellido,
      telefono: this.telefono === '—' ? '' : this.telefono,
      email:    this.email    === '—' ? '' : this.email,
    };
  }


  private validarFormulario(): boolean {

  if (this.form.nombre.trim().length > 100) {
    this.notificationService.showError(
      'El nombre no puede superar 100 caracteres.'
    );
    return false;
  }

  if (this.form.apellido.trim().length > 100) {
    this.notificationService.showError(
      'El apellido no puede superar 100 caracteres.'
    );
    return false;
  }

  if (
    this.form.telefono &&
    !/^[0-9]{9}$/.test(this.form.telefono.trim())
  ) {
    this.notificationService.showError(
      'El teléfono debe tener exactamente 9 dígitos.'
    );
    return false;
  }

  if (
    this.form.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())
  ) {
    this.notificationService.showError(
      'El correo electrónico no es válido.'
    );
    return false;
  }

  return true;
}

  onEditar(): void {
    this.resetForm();
    this.editando = true;
  }

  onCancelar(): void {
    this.editando = false;
    this.resetForm();
  }
onGuardar(): void {

    if (!this.usuarioId) {
        this.notificationService.showWarn(
          'No se pudo identificar el usuario.'
        );
        return;
    }

    if (!this.validarFormulario()) {
        return;
    }

    this.guardando = true;

    this.personaService.actualizarPersonaPorUsuarioId(
      this.usuarioId,
      {
        nombre: this.form.nombre.trim(),
        apellido: this.form.apellido.trim(),
        telefono: this.form.telefono.trim(),
        email: this.form.email.trim(),
      }
    ).subscribe({
        next: (res) => {

            this.guardando = false;

            this.nombre = this.form.nombre || '—';
            this.apellido = this.form.apellido || '—';
            this.telefono = this.form.telefono || '—';
            this.email = this.form.email || '—';

            this.editando = false;

            this.notificationService.showSuccess(
              res?.message || 'Datos actualizados correctamente.'
            );
        },
        error: (err) => {
            this.guardando = false;
            this.notificationService.showHttpError(
              err,
              'Actualizar datos'
            );
        }
    });
}

}

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
        this.notificationService.showWarn('No se pudo identificar el usuario.');
        return;
    }

    this.guardando = true;

    this.personaService.actualizarPersonaPorUsuarioId(this.usuarioId, {
        nombre:   this.form.nombre,
        apellido: this.form.apellido,
        telefono: this.form.telefono,
        email:    this.form.email,
    }).subscribe({
        next: (res) => {
            this.guardando = false;
            this.nombre   = this.form.nombre   || '—';
            this.apellido = this.form.apellido || '—';
            this.telefono = this.form.telefono || '—';
            this.email    = this.form.email    || '—';
            this.editando = false;
            this.notificationService.showSuccess(res?.message || 'Datos actualizados correctamente.');
        },
        error: (err) => {
            this.guardando = false;
            this.notificationService.showHttpError(err, 'Actualizar datos');
        }
    });
}

}

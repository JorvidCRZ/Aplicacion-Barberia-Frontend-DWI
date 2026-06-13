import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { PersonaService } from '@/app/core/services/gestion/persona.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-datos-basicos-perfil-barbero',
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-basicos-perfil-barbero.html',
  styleUrl: './datos-basicos-perfil-barbero.css',
})
export class DatosBasicosPerfilBarbero implements OnInit {

  @Input() barberoId!: number;
  @Input() personaId!: number;

  @Input() nombre       = '—';
  @Input() apellido     = '—';
  @Input() telefono     = '—';
  @Input() email        = '—';
  @Input() fechaIngreso = '—';
  @Input() experiencia  = '—';
  @Input() sueldo       = '—';
  @Input() comision     = '—';
  @Input() descripcion  = '—';

  private barberoService      = inject(BarberoService);
  private personaService      = inject(PersonaService);
  private notificationService = inject(NotificationService);

  editando  = false;
  guardando = false;

  form = {
    nombre:      '',
    apellido:    '',
    telefono:    '',
    email:       '',
    experiencia: 0,
    sueldo:      0,
    comision:    0,
    descripcion: '',
  };


  private validarFormulario(): boolean {

// PERSONA

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
'El teléfono debe tener 9 dígitos.'
);
return false;
}

if (
this.form.email &&
!/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(this.form.email.trim())
) {
this.notificationService.showError(
'El email no tiene un formato válido.'
);
return false;
}

// BARBERO

if (
this.form.experiencia < 0 ||
this.form.experiencia > 60
) {
this.notificationService.showError(
'La experiencia debe estar entre 0 y 60 años.'
);
return false;
}

if (this.form.sueldo <= 0) {
this.notificationService.showError(
'El sueldo debe ser mayor a 0.'
);
return false;
}

const sueldoRegex = /^\d{1,8}(.\d{1,2})?$/;

if (!sueldoRegex.test(this.form.sueldo.toString())) {
this.notificationService.showError(
'El sueldo debe tener máximo 8 enteros y 2 decimales.'
);
return false;
}

if (
this.form.comision < 0 ||
this.form.comision > 100
) {
this.notificationService.showError(
'La comisión debe estar entre 0 y 100%.'
);
return false;
}

const comisionRegex = /^\d{1,3}(.\d{1,2})?$/;

if (!comisionRegex.test(this.form.comision.toString())) {
this.notificationService.showError(
'La comisión debe tener máximo 3 enteros y 2 decimales.'
);
return false;
}

if (
this.form.descripcion &&
this.form.descripcion.length > 500
) {
this.notificationService.showError(
'La descripción no puede superar 500 caracteres.'
);
return false;
}

return true;
}


  ngOnInit(): void {
    this.resetForm();
  }

  private resetForm(): void {
    this.form = {
      nombre:      this.nombre      === '—' ? '' : this.nombre,
      apellido:    this.apellido    === '—' ? '' : this.apellido,
      telefono:    this.telefono    === '—' ? '' : this.telefono,
      email:       this.email       === '—' ? '' : this.email,
      experiencia: parseInt(this.experiencia)                 || 0,
      sueldo:      parseFloat(this.sueldo.replace('S/ ', '')) || 0,
      comision:    parseFloat(this.comision.replace('%', '')) || 0,
      descripcion: this.descripcion === '—' ? '' : this.descripcion,
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

  if (!this.validarFormulario()) {
    return;
  }

  this.guardando = true;

  forkJoin([
    this.personaService.actualizarPersona(this.personaId, {
      nombre: this.form.nombre.trim(),
      apellido: this.form.apellido.trim(),
      telefono: this.form.telefono.trim(),
      email: this.form.email.trim(),
    }),
    this.barberoService.actualizar(this.barberoId, {
      experiencia: this.form.experiencia,
      sueldo: this.form.sueldo,
      comision: this.form.comision,
      descripcion: this.form.descripcion.trim(),
    }),
  ]).subscribe({
    next: ([personaRes, barberoRes]) => {

      this.guardando = false;

      if (!personaRes?.success || !barberoRes?.success) {
        this.notificationService.showError(
          'No se pudieron guardar todos los cambios.'
        );
        return;
      }

      this.nombre = this.form.nombre || '—';
      this.apellido = this.form.apellido || '—';
      this.telefono = this.form.telefono || '—';
      this.email = this.form.email || '—';
      this.experiencia = `${this.form.experiencia} años`;
      this.sueldo = `S/ ${this.form.sueldo.toFixed(2)}`;
      this.comision = `${this.form.comision}%`;
      this.descripcion = this.form.descripcion || '—';

      this.editando = false;

      this.notificationService.showSuccess(
        'Datos actualizados correctamente.'
      );
    },
    error: (err) => {
      this.guardando = false;
      this.notificationService.showHttpError(err, 'Error');
    }
  });
}
}
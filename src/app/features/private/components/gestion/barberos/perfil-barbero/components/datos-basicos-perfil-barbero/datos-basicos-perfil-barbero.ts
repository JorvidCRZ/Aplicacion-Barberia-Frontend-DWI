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
    this.guardando = true;

    forkJoin([
      this.personaService.actualizarPersona(this.personaId, {
        nombre:   this.form.nombre,
        apellido: this.form.apellido,
        telefono: this.form.telefono,
        email:    this.form.email,
      }),
      this.barberoService.actualizar(this.barberoId, {
        experiencia: this.form.experiencia,
        sueldo:      this.form.sueldo,
        comision:    this.form.comision,
        descripcion: this.form.descripcion,
      }),
    ]).subscribe({
      next: ([personaRes, barberoRes]) => {
        this.guardando = false;

        if (!personaRes?.success || !barberoRes?.success) {
          this.notificationService.showError('No se pudieron guardar todos los cambios.');
          return;
        }

        this.nombre      = this.form.nombre      || '—';
        this.apellido    = this.form.apellido    || '—';
        this.telefono    = this.form.telefono    || '—';
        this.email       = this.form.email       || '—';
        this.experiencia = `${this.form.experiencia} años`;
        this.sueldo      = `S/ ${this.form.sueldo.toFixed(2)}`;
        this.comision    = `${this.form.comision}%`;
        this.descripcion = this.form.descripcion || '—';

        this.editando = false;
        this.notificationService.showSuccess('Datos actualizados correctamente.');
      },
      error: (err) => {
        this.guardando = false;
        this.notificationService.showHttpError(err, 'Error');
      }
    });
  }
}
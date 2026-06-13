import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { PersonaService } from '@/app/core/services/gestion/persona.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-informacion-basica',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule
  ],
  templateUrl: './informacion-basica.html',
  styleUrl: './informacion-basica.css',
})
export class InformacionBasica {

  private fb = inject(FormBuilder);

  private personaService = inject(PersonaService);
  private notificationService = inject(NotificationService);

  @Input() personaId!: number;

  @Input() nombre: string = '';

  @Input() apellido: string = '';

  @Input() telefono: string = '';

  @Input() email: string = '';

  @Input() registro: string = '';

  @Output() actualizado = new EventEmitter<void>();

  editando = false;

  cargando = false;

  form = this.fb.group({

  nombre: [
    '',
    [
      Validators.required,
      Validators.maxLength(100)
    ]
  ],

  apellido: [
    '',
    [
      Validators.required,
      Validators.maxLength(100)
    ]
  ],

  telefono: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{9}$')
    ]
  ],

  email: [
    '',
    [
      Validators.required,
      Validators.email
    ]
  ]
});

  get f() {
    return this.form.controls;
  }

  onPhoneInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const onlyDigits = input.value.replace(/\D+/g, '').slice(0, 9);
    input.value = onlyDigits;
    this.form.get('telefono')?.setValue(onlyDigits);
  }

  ngOnInit(): void {
    this.cargarFormulario();
  }

  private cargarFormulario(): void {

    this.form.patchValue({

      nombre: this.nombre,

      apellido: this.apellido,

      telefono: this.telefono,

      email: this.email
    });
  }

  activarEdicion(): void {

    this.editando = true;

    this.cargarFormulario();
  }

  cancelar(): void {

    this.editando = false;

    this.cargarFormulario();
  }

  guardar(): void {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.cargando = true;

    this.personaService.actualizarPersona(
      this.personaId,
      this.form.getRawValue() as any
    )
      .subscribe({

        next: (response) => {

          this.nombre = this.form.value.nombre ?? '';

          this.apellido = this.form.value.apellido ?? '';

          this.telefono = this.form.value.telefono ?? '';

          this.email = this.form.value.email ?? '';

          this.editando = false;

          this.cargando = false;

          this.notificationService.showSuccess(
            response?.message || 'Datos actualizados correctamente',
            'Actualizado'
          );

          this.actualizado.emit();
        },

        error: (err) => {

          this.cargando = false;

          this.notificationService.showHttpError(err, 'Error');
        }
      });
  }
}
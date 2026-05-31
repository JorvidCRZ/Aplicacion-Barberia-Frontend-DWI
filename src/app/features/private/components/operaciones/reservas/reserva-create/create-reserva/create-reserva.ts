import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { map, Observable, of, Subject, takeUntil, debounceTime, switchMap, catchError, finalize } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { Cliente } from '@/app/core/models/gestion/cliente/cliente.model';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { Barbero } from '@/app/core/models/gestion/barbero/barbero.model';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';
import { Router } from '@angular/router';
import { ReservaService } from '@/app/core/services/operaciones/reserva-service';
import { ReservaRequest } from '@/app/core/models/reserva/reservaRequest';
import { ServicioFiltro } from '@/app/core/models/catalogos/servicios.model';

@Component({
  selector: 'app-create-reserva',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './create-reserva.html',
  styleUrl: './create-reserva.css'
})
export class CreateReserva implements OnInit, OnDestroy {

  private fb = inject(FormBuilder);
  private clienteService = inject(ClienteService);
  private barberoService = inject(BarberoService);
  private servicioService = inject(ServicioService);
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  clientes$!: Observable<Cliente[]>;
  barberos$!: Observable<Barbero[]>;
  servicios$!: Observable<Servicio[]>;

  isLoading = false;
  checkingDisponibility = false;
  showConfirmDialog = false;
  reservaPreview: any = null;
  today = new Date();

  clientesCache: any[] = [];
  barberosCache: any[] = [];
  serviciosCache: Servicio[] = [];
  servicioFiltro: ServicioFiltro = { page: 0, size: 1000 };

  horarios = [
    { label: '09:00 AM', value: '09:00', disabled: false },
    { label: '09:30 AM', value: '09:30', disabled: false },
    { label: '10:00 AM', value: '10:00', disabled: false },
    { label: '10:30 AM', value: '10:30', disabled: false },
    { label: '11:00 AM', value: '11:00', disabled: false },
    { label: '11:30 AM', value: '11:30', disabled: false },
    { label: '12:00 PM', value: '12:00', disabled: false },
    { label: '12:30 PM', value: '12:30', disabled: false },
    { label: '02:00 PM', value: '14:00', disabled: false },
    { label: '02:30 PM', value: '14:30', disabled: false },
    { label: '03:00 PM', value: '15:00', disabled: false },
    { label: '03:30 PM', value: '15:30', disabled: false },
    { label: '04:00 PM', value: '16:00', disabled: false },
    { label: '04:30 PM', value: '16:30', disabled: false },
    { label: '05:00 PM', value: '17:00', disabled: false }
  ];

  reservaForm = this.fb.group({
    clienteId: [null, [Validators.required]],
    barberoId: [null, [Validators.required]],
    servicioId: [null, [Validators.required]],
    fecha: [null, [Validators.required, this.fechaValida.bind(this)]],
    hora: [null, [Validators.required]],
    observacion: ['', [Validators.maxLength(500)]]
  });

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private cargarDatos(): void {
    // Cargar clientes
    this.clientes$ = this.clienteService.listar(0, 1000).pipe(
      map(response => {
        if (response?.data?.content) {
          this.clientesCache = response.data.content.map((cliente: Cliente) => ({
            ...cliente,
            nombreCompleto: `${cliente.persona.nombre} ${cliente.persona.apellido}`,
            email: cliente.persona.email,
            telefono: cliente.persona.telefono
          }));

          return this.clientesCache;
        }

        return [];
      })
    );

    // Cargar barberos
    this.barberos$ = this.barberoService.listar(0, 1000).pipe(
      map(response => {
        if (response?.data?.content) {

          this.barberosCache = response.data.content.map((barbero: Barbero) => ({
            ...barbero,
            nombreCompleto: `${barbero.persona?.nombre ?? ''} ${barbero.persona?.apellido ?? ''}`.trim()
          } as Barbero & { nombreCompleto: string }));

          return this.barberosCache;
        }

        return [];
      })
    );

    // Cargar servicios
    this.servicios$ = this.servicioService.obtenerServiciosConFiltro(this.servicioFiltro).pipe(
      map(servicios => {
        if (servicios?.data?.content) {
          this.serviciosCache = servicios.data.content;
        }
        return this.serviciosCache;
      })
    );
  }


  fechaValida(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fecha < hoy) {
      return { fechaInvalida: true };
    }

    return null;
  }

  guardarReserva(): void {
    if (this.reservaForm.invalid) {
      this.reservaForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    const reserva = this.reservaForm.getRawValue();

    this.reservaPreview = {
      ...reserva,
      fechaFormateada: reserva.fecha ? new Date(reserva.fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : ''
    };

    this.showConfirmDialog = true;
  }

  confirmarGuardar(): void {
    this.showConfirmDialog = false;
    this.isLoading = true;

    const form = this.reservaForm.getRawValue();

    if (!form.fecha) {
      this.isLoading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Fecha inválida',
        detail: 'La fecha es requerida'
      });
      return;
    }

    const fecha = new Date(form.fecha as string | Date);

    const reservaRequest: ReservaRequest = {
      clienteId: form.clienteId!,
      barberoId: form.barberoId!,
      servicioId: form.servicioId!,
      fecha: fecha.toISOString().split('T')[0],
      horaInicio: form.hora!,
      observacion: form.observacion ?? ''
    };

    console.log('Payload enviado:', reservaRequest);

    this.reservaService.guardarReserva(reservaRequest)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Respuesta crear reserva:', response);

          this.messageService.add({
            severity: 'success',
            summary: '¡Reserva creada!',
            detail: 'La reserva se creó correctamente.',
            life: 3000
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard/admin/operaciones/reservas']);
          }, 2000);
        },

        error: (error) => {
          console.error('Error al guardar reserva:', error);

          this.messageService.add({
            severity: 'error',
            summary: 'Error del servidor',
            detail:
              error?.error?.message ??
              'Ocurrió un error al crear la reserva.',
            life: 4000
          });
        }
      });
  }

  getClienteNombre(): string {
    const clienteId = this.reservaForm.get('clienteId')?.value;
    const cliente = this.clientesCache.find(c => c.clienteId === clienteId);
    return cliente?.nombreCompleto || 'Cargando...';
  }

  getBarberoNombre(): string {
    const barberoId = this.reservaForm.get('barberoId')?.value;
    const barbero = this.barberosCache.find(b => b.barberoId === barberoId);
    return barbero?.nombreCompleto || 'Cargando...';
  }

  getServicioNombre(): string {
    const servicioId = this.reservaForm.get('servicioId')?.value;
    if (servicioId == null) return 'Cargando...';
    const servicio = this.serviciosCache.find(s => s.servicioId === servicioId);
    return servicio?.nombre || 'Cargando...';
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/admin/operaciones/reservas']);
  }

  // Getters para validaciones
  get clienteInvalido(): boolean {
    const control = this.reservaForm.get('clienteId');
    return !!control?.invalid && control.touched;
  }

  get barberoInvalido(): boolean {
    const control = this.reservaForm.get('barberoId');
    return !!control?.invalid && control.touched;
  }

  get servicioInvalido(): boolean {
    const control = this.reservaForm.get('servicioId');
    return !!control?.invalid && control.touched;
  }

  get fechaInvalida(): boolean {
    const control = this.reservaForm.get('fecha');
    return !!control?.invalid && control.touched;
  }

  get horaInvalida(): boolean {
    const control = this.reservaForm.get('hora');
    return !!control?.invalid && control.touched;
  }
}





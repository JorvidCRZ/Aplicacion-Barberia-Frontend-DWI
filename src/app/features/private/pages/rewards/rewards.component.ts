import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { map } from 'rxjs';

import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { RecompensaService } from '@core/services/recompensa/recompensa.service';
import { Recompensa } from '@core/models/recompensas/Recompensa.model';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';
import { ReservaService } from '@/app/core/services/operaciones/reserva-service';
import { ReservaRequest } from '@/app/core/models/reserva/reservaRequest';
import { Barbero } from '@/app/core/models/gestion/barbero/barbero.model';
import { Servicio, ServicioFiltro } from '@/app/core/models/catalogos/servicios.model';
import { finalize } from 'rxjs/operators';

interface HistorialItem {
  tipo: string;
  fecha: string;
  gratis: boolean;
  numero: number;
}

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectModule,
    DatePickerModule,
    TextareaModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './rewards.html',
  styleUrl: './rewards.css',
})
export class RewardsComponent implements OnInit {

  private recompensaService = inject(RecompensaService);
  private barberoService = inject(BarberoService);
  private servicioService = inject(ServicioService);
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  slots = Array.from({ length: 10 }, (_, i) => i + 1);
  today = new Date();

  recompensa: Recompensa | null = null;
  cargando = true;
  error: string | null = null;
  historial: HistorialItem[] = [];

  // Modal
  showReservaModal = false;
  isGuardando = false;

  barberos: (Barbero & { nombreCompleto: string })[] = [];
  servicios: Servicio[] = [];

  horarios = [
    { label: '09:00 AM', value: '09:00' },
    { label: '09:30 AM', value: '09:30' },
    { label: '10:00 AM', value: '10:00' },
    { label: '10:30 AM', value: '10:30' },
    { label: '11:00 AM', value: '11:00' },
    { label: '11:30 AM', value: '11:30' },
    { label: '12:00 PM', value: '12:00' },
    { label: '12:30 PM', value: '12:30' },
    { label: '02:00 PM', value: '14:00' },
    { label: '02:30 PM', value: '14:30' },
    { label: '03:00 PM', value: '15:00' },
    { label: '03:30 PM', value: '15:30' },
    { label: '04:00 PM', value: '16:00' },
    { label: '04:30 PM', value: '16:30' },
    { label: '05:00 PM', value: '17:00' },
  ];

  reservaGratisForm = this.fb.group({
    barberoId: [null, [Validators.required]],
    servicioId: [null, [Validators.required]],
    fecha: [null, [Validators.required, this.fechaValida.bind(this)]],
    hora: [null, [Validators.required]],
    observacion: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    this.cargarRecompensa();
  }

  cargarRecompensa(): void {
    this.cargando = true;
    this.error = null;

    this.recompensaService.getMiTarjeta().subscribe({
      next: (res) => {
        this.recompensa = res.data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la tarjeta de recompensas.';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  canRedeem(): boolean {
    const acumulados = this.recompensa?.cortesAcumulados ?? 0;
    return acumulados >= 10 || (this.recompensa?.tieneCorteGratis ?? false);
  }

  progressPct(): number {
    if (!this.recompensa) return 0;
    return (this.recompensa.cortesAcumulados / 10) * 100;
  }

  getLevelLabel(): string {
    const total = this.recompensa?.cortesAcumulados ?? 0;
    if (total >= 30) return 'Nivel Oro ✦';
    if (total >= 15) return 'Nivel Plata';
    return 'Miembro';
  }

  onCanjear(): void {
    if (!this.canRedeem()) return;
    this.cargarDatosModal();
    this.showReservaModal = true;
  }

  cerrarModal(): void {
    this.showReservaModal = false;
    this.reservaGratisForm.reset();
  }

  private cargarDatosModal(): void {
    // Barberos
    if (this.barberos.length === 0) {
      this.barberoService.listar(0, 1000).pipe(
        map(response => response?.data?.content ?? [])
      ).subscribe(list => {
        this.barberos = list.map((b: Barbero) => ({
          ...b,
          nombreCompleto: `${b.persona?.nombre ?? ''} ${b.persona?.apellido ?? ''}`.trim(),
        }));
      });
    }

    // Servicios
    if (this.servicios.length === 0) {
      const filtro: ServicioFiltro = { page: 0, size: 1000 };
      this.servicioService.obtenerServiciosConFiltro(filtro).pipe(
        map(res => res?.data?.content ?? [])
      ).subscribe(list => {
        this.servicios = list;
      });
    }
  }

  fechaValida(control: AbstractControl): ValidationErrors | null {
    const fecha = control.value;
    if (!fecha) return null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return fecha < hoy ? { fechaInvalida: true } : null;
  }

  campoInvalido(campo: string): boolean {
    const control = this.reservaGratisForm.get(campo);
    return !!control?.invalid && !!control?.touched;
  }

  guardarReservaGratis(): void {
    if (this.reservaGratisForm.invalid) {
      this.reservaGratisForm.markAllAsTouched();
      return;
    }

    this.isGuardando = true;
    const form = this.reservaGratisForm.getRawValue();
    const fecha = new Date(form.fecha as unknown as string | Date);

    const request: ReservaRequest = {
      clienteId: this.recompensa!.clienteId,
      barberoId: form.barberoId!,
      servicioId: form.servicioId!,
      fecha: fecha.toISOString().split('T')[0],
      horaInicio: form.hora!,
      observacion: form.observacion ?? '',
      esGratis: true,
    };

    this.reservaService.guardarReserva(request)
      .pipe(finalize(() => (this.isGuardando = false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: '¡Reserva creada!',
            detail: 'Tu corte gratuito ha sido reservado correctamente.',
            life: 3500,
          });
          this.cerrarModal();
          this.cargarRecompensa(); // refresca puntos
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err?.error?.message ?? 'No se pudo crear la reserva.',
            life: 4000,
          });
        },
      });
  }
}
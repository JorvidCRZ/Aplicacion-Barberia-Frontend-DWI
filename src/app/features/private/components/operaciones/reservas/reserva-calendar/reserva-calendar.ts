import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { ReservaService } from '@/app/core/services/operaciones/reserva.service';
import { Reserva } from '@/app/core/models/operaciones/Reserva.model';
import { finalize } from 'rxjs';

@Component({ 
  selector: 'app-calendar-reservas',
  standalone: true,
  imports: [CommonModule, ToastModule, DialogModule],
  providers: [MessageService, DatePipe],
  templateUrl: './reserva-calendar.html',
})
export class CalendarReservas implements OnInit {

  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);

  isLoading = false;
  fechaActual = new Date();

  todasLasReservas: Reserva[] = [];
  reservasDelDia: Reserva[] = [];
  barberos: string[] = [];

  showDetalle = false;
  reservaSeleccionada: Reserva | null = null;

  horasGrilla = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30'
  ];

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.isLoading = true;
    this.reservaService.getReservas(0, 1000)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          this.todasLasReservas = response?.data?.content ?? [];
          this.filtrarPorFecha();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las reservas'
          });
        }
      });
  }

  filtrarPorFecha(): void {
    const fechaStr = this.fechaActual.toISOString().split('T')[0];
    this.reservasDelDia = this.todasLasReservas.filter(r => 
      typeof r.fecha === 'string' && r.fecha === fechaStr
    );
    // Extraer barberos únicos del día
    this.barberos = [...new Set(this.reservasDelDia.map(r => r.barberoNombre))];
  }

  cambiarDia(dias: number): void {
    const nueva = new Date(this.fechaActual);
    nueva.setDate(nueva.getDate() + dias);
    this.fechaActual = nueva;
    this.filtrarPorFecha();
  }

  irAHoy(): void {
    this.fechaActual = new Date();
    this.filtrarPorFecha();
  }

  get esHoy(): boolean {
    const hoy = new Date().toISOString().split('T')[0];
    return this.fechaActual.toISOString().split('T')[0] === hoy;
  }

  // Busca reserva para un barbero en una hora específica
  getReserva(barbero: string, hora: string): Reserva | null {
    return this.reservasDelDia.find(r =>
      r.barberoNombre === barbero &&
        String(r.horaInicio).substring(0, 5) === hora
    ) ?? null;
  }

  getColorEstado(estado: string | null): string {
    switch (estado) {
      case 'CONFIRMADA':
        return 'bg-[#1a3a2a] border border-[#2d6a4a]';
      case 'PENDIENTE':
        return 'bg-[#3a2a1a] border border-[#C9A84C]/50';
      case 'CANCELADA':
        return 'bg-[#3a1a1a] border border-[#c0392b]/50';
      default:
        return 'bg-[#2a2a2a] border border-[#444444]';
    }
  }

  verDetalle(reserva: Reserva): void {
    this.reservaSeleccionada = reserva;
    this.showDetalle = true;
  }
}
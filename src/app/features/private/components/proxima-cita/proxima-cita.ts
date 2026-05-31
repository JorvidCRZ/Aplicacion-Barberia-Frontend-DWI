import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaDTO, EstadoReserva } from '@/app/core/models/gestion/cliente/ClienteResumen.model';

@Component({
  selector: 'app-proxima-cita',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proxima-cita.html',
  styleUrl: './proxima-cita.css',
})
export class ProximaCita {
  @Input() reserva: ReservaDTO | null = null;
@Output() verDetalle  = new EventEmitter<number>();
@Output() reprogramar = new EventEmitter<number>();

formatFechaHora(fecha: string, hora: string): string {
  // Parseamos manualmente para evitar problemas de timezone
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [h, m] = hora.split(':').map(Number);

  const dt  = new Date(anio, mes - 1, dia); // mes es 0-indexed
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const suffix  = h >= 12 ? 'PM' : 'AM';
  const h12     = h % 12 === 0 ? 12 : h % 12;
  const horaFmt = `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;

  if (hoy.toDateString() === dt.toDateString()) return `Hoy · ${horaFmt}`;
  const man = new Date(hoy); man.setDate(hoy.getDate() + 1);
  if (man.toDateString() === dt.toDateString()) return `Mañana · ${horaFmt}`;
  return `${dt.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })} · ${horaFmt}`;
}

  estadoLabel(estado: EstadoReserva): string {
    const map: Record<EstadoReserva, string> = {
      CONFIRMADA: 'Confirmada', PENDIENTE_PAGO: 'Pendiente pago',
      EN_PROCESO: 'En proceso', FINALIZADA: 'Finalizada',
      CANCELADA: 'Cancelada', CANCELADA_AUTOMATICA: 'Cancelada', NO_ASISTIO: 'No asistió',
    };
    return map[estado] ?? estado;
  }
}

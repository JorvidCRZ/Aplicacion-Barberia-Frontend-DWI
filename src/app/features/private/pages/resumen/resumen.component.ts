import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ClienteDetalleResumenDTO, ServicioResponseDTO } from '@/app/core/models/gestion/cliente/ClienteResumen.model';
import { ResumenCliente } from '@/app/core/services/gestion/resumen-cliente.service';

interface CitaResumen {
  reservaId: number;
  fecha: string;
  hora: string;
  servicio: string;
  barbero: string;
  estado: string;
  monto: number | string;
}

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class ResumenComponent implements OnInit {
  private svc    = inject(ResumenCliente);
  private router = inject(Router);

  username          = '';
  proximasCitas:    CitaResumen[] = [];
  historialReciente: CitaResumen[] = [];
  kpis:             ClienteDetalleResumenDTO | null = null;
  loading           = true;
  error             = '';

 ngOnInit(): void {
  this.username = this.svc.getUsername();

  this.svc.cargarDashboard().subscribe({
    next: ({ proximasCitas, historialReciente, kpis }) => {
this.proximasCitas = proximasCitas.map((r: any) => ({
  reservaId: r.reservaId,
  fecha:     r.fecha,
  hora:      r.horaInicio?.substring(0, 5) ?? '--',
  servicio:  r.servicio ?? '—',
  barbero:   r.barberoNombre ?? '—',
  estado:    r.estadoReserva,
  monto:     r.tipoReserva === 'RESERVA_GRATIS' ? 'Gratis' : (r.total ?? '—'),
}));

this.historialReciente = historialReciente.map((r: any) => ({
  reservaId: r.reservaId,
  fecha:     r.fecha,
  hora:      r.horaInicio?.substring(0, 5) ?? '--',
  servicio:  r.servicio ?? '—',
  barbero:   r.barberoNombre ?? '—',
  estado:    r.estadoReserva,
  monto:     r.tipoReserva === 'RESERVA_GRATIS' ? 'Gratis' : (r.total ?? '—'),
}));

      this.kpis    = kpis;
      this.loading = false;
    },
    error: (err) => {
      console.error('ERROR DASHBOARD:', err);
      this.error   = 'Error al cargar el dashboard. Intenta nuevamente.';
      this.loading = false;
    },
  });
}
  onVerDetalle(id: number)  { this.router.navigate(['/mi-cuenta/reservas', id]); }
  onVerHistorial()          { this.router.navigate(['/mi-cuenta/historial']); }
  onReservar(s: ServicioResponseDTO) {
    this.router.navigate(['/mi-cuenta/reservar'], { queryParams: { servicioId: s.servicioId } });
  }

formatFechaCorta(fecha: string): string {
  if (!fecha || fecha === 'Sin visitas') return '—';
  const d = new Date(fecha.includes('T') ? fecha : fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
}

formatFechaCita(fecha: string): string {
  if (!fecha || fecha === 'Sin visitas') return '—';
  const d = new Date(fecha.includes('T') ? fecha : fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' });
}

formatFechaTabla(fecha: string): string {
  if (!fecha) return '--';
  const d = new Date(fecha.includes('T') ? fecha : fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return '--';
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

formatUltimaVisita(fecha: string): string {
  if (!fecha || fecha === 'Sin visitas') return 'Sin visitas';
  
  const d = new Date(fecha.includes('T') ? fecha : fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return 'Sin visitas';
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  d.setHours(0, 0, 0, 0);
  
  const dias = Math.floor((hoy.getTime() - d.getTime()) / 86400000);
  
  if (dias < 0)  return 'Reciente';
  if (dias === 0) return 'Hoy';
  if (dias === 1) return 'Ayer';
  if (dias < 30)  return `Hace ${dias} días`;
  const meses = Math.floor(dias / 30);
  return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
}

}
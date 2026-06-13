import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ResumenCliente } from '@/app/core/services/gestion/resumen-cliente';
import { ReservaDTO, ClienteDetalleResumenDTO, ServicioResponseDTO } from '@/app/core/models/gestion/cliente/ClienteResumen.model';
import { ProximaCita } from '../../components/proxima-cita/proxima-cita';
import { ServiciosRecomendados } from '../../components/servicios-recomendados/servicios-recomendados';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, ProximaCita, ServiciosRecomendados],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class ResumenComponent implements OnInit {
  private svc    = inject(ResumenCliente);
  private router = inject(Router);

  username     = '';
  proximaCita: ReservaDTO | null = null;
  kpis:        ClienteDetalleResumenDTO | null = null;
  servicios:   ServicioResponseDTO[] = [];
  loading      = true;
  error        = '';

ngOnInit(): void {
  this.username = this.svc.getUsername();

  this.svc.cargarDashboard().subscribe({
 next: ({ proximaCita, kpis, servicios }) => {
  console.log('PROXIMA CITA RECIBIDA:', proximaCita);
  this.proximaCita = proximaCita;
  this.kpis        = kpis;
  this.servicios   = servicios;
  this.loading     = false;
},
    error: (err) => {
      console.error('ERROR DASHBOARD:', err);
      this.error   = 'Error al cargar el dashboard. Intenta nuevamente.';
      this.loading = false;
    },
  }); 
}    

  onVerDetalle(id: number)  { this.router.navigate(['/mi-cuenta/reservas', id]); }
  onReprogramar(id: number) { this.router.navigate(['/mi-cuenta/reservas', id, 'reprogramar']); }
  onReservar(s: ServicioResponseDTO) {
    this.router.navigate(['/mi-cuenta/reservar'], { queryParams: { servicioId: s.servicioId } });
  }

formatUltimaVisita(fecha: string): string {

  if (!fecha) return 'Ayer';

  const dias = Math.floor(
    (Date.now() - new Date(fecha).getTime()) / 86400000
  );

  // Si viene una fecha futura o incorrecta
  if (dias < 0) {
    return 'Ayer';
  }

  if (dias === 0) {
    return 'Hoy';
  }

  if (dias === 1) {
    return 'Ayer';
  }

  if (dias < 30) {
    return `Hace ${dias} días`;
  }

  const meses = Math.floor(dias / 30);

  return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
}
}
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ResumenadminService } from '@/app/core/services/gestion/resumen-admin.service';
import {
  DashboardData,
  KpiCard,
  CitaBarberoResponseDTO,
  EstadoReserva,
} from '@/app/core/models/gestion/admin/resumen-admin';

type Periodo = 'hoy' ;

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  periodos: { key: Periodo; label: string }[] = [
    { key: 'hoy',   label: 'Hoy' },
  ];
  periodoActivo: Periodo = 'hoy';

  kpiCards: KpiCard[]             = [];
  citas: CitaBarberoResponseDTO[] = [];
  fechaActual                     = new Date();
  loading                         = true;
  loadingCitas                    = false;
  error: string | null            = null;

  constructor(private resumenService: ResumenadminService) {}

  ngOnInit(): void {
    this.cargarDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDashboard(): void {
    this.loading = true;
    this.error   = null;

    this.resumenService
      .getDashboardData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: DashboardData) => {
          this.kpiCards = this.resumenService.buildKpiCards(data);
          this.citas = data.citas || [];
          this.loading  = false;
        },
        error: (err) => {
          console.error('Error cargando dashboard:', err);
          this.error   = 'No se pudo cargar el dashboard. Verifica la conexión.';
          this.loading = false;
        },
      });
  }

  cambiarPeriodo(periodo: Periodo): void {
    this.periodoActivo = periodo;
    this.cargarDashboard();
  }

  refrescarCitas(): void {
    this.loadingCitas = true;

    this.resumenService
      .getCitasHoy()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (citas) => {
          this.citas        = citas;
          this.loadingCitas = false;
        },
        error: () => {
          this.loadingCitas = false;
        },
      });
  }

  getNombreCompleto(cita: CitaBarberoResponseDTO): string {
    return `${cita.nombreCliente} ${cita.apellidoCliente}`.trim();
  }

  getServicioResumen(cita: CitaBarberoResponseDTO): string {
    if (!cita.servicios?.length) return '—';
    return cita.servicios
  .map((s: any) => s.nombreCorte)
  .join(', ');
  }

  getEstadoClass(estado: EstadoReserva): string {
    const map: Record<EstadoReserva, string> = {
      PENDIENTE:  'badge-warning',
      CONFIRMADA: 'badge-info',
      EN_PROCESO: 'badge-primary',
      COMPLETADA: 'badge-success',
      CANCELADA:  'badge-danger',
    };
    return map[estado] ?? 'badge-warning';
  }

  getEstadoLabel(estado: EstadoReserva): string {
    const map: Record<EstadoReserva, string> = {
      PENDIENTE:  'Pendiente',
      CONFIRMADA: 'Confirmada',
      EN_PROCESO: 'En proceso',
      COMPLETADA: 'Completada',
      CANCELADA:  'Cancelada',
    };
    return map[estado] ?? estado;
  }

  trackByKpi(_: number, kpi: KpiCard): string                  { return kpi.label; }
  trackByCita(_: number, cita: CitaBarberoResponseDTO): number { return cita.idReserva; }
}
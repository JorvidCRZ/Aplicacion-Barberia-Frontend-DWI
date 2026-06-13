import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { Chart, CategoryScale, LinearScale, BarElement, BarController, Tooltip } from 'chart.js';
import { ResumenadminService } from '@/app/core/services/gestion/resumen-admin.service';
import { DashboardData, KpiCard, CitaBarberoResponseDTO, EstadoReserva,} from '@/app/core/models/gestion/admin/resumen-admin';
import { PrediccionService, PrediccionResponse, PrediccionDia } from '@/app/core/services/analisis/prediccion.service';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip);

type Periodo = 'hoy';

@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css',
})
export class Resumen implements OnInit, OnDestroy {

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;
  private destroy$ = new Subject<void>();

  periodos: { key: Periodo; label: string }[] = [
    { key: 'hoy', label: 'Hoy' },
  ];
  periodoActivo: Periodo = 'hoy';

  kpiCards: KpiCard[]             = [];
  citas: CitaBarberoResponseDTO[] = [];
  fechaActual                     = new Date();
  loading                         = true;
  loadingCitas                    = false;
  error: string | null            = null;

  loadingPrediccion = true;
  diaPico           = '';
  totalEstimado     = 0;

  constructor(
    private resumenService: ResumenadminService,
    private prediccionService: PrediccionService
  ) {}

  ngOnInit(): void {
    this.cargarDashboard();
    this.cargarPrediccion();
  }

  ngOnDestroy(): void {
    if (this.chartInstance) this.chartInstance.destroy();
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
          this.citas    = data.citas || [];
          this.loading  = false;
        },
        error: (err) => {
          console.error('Error cargando dashboard:', err);
          this.error   = 'No se pudo cargar el dashboard. Verifica la conexión.';
          this.loading = false;
        },
      });
  }

  cargarPrediccion(): void {
  this.loadingPrediccion = true;
  this.prediccionService.getPredicciones()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res: PrediccionResponse) => {
        const preds: PrediccionDia[] = res.predicciones;
        const vals: number[]         = preds.map((p: PrediccionDia) => p.clientes_predichos);
        const max: number            = Math.max(...vals);
        this.diaPico       = preds.find((p: PrediccionDia) => p.clientes_predichos === max)?.dia ?? '';
        this.totalEstimado = vals.reduce((a: number, b: number) => a + b, 0);
        this.loadingPrediccion = false;

        setTimeout(() => {
  if (this.chartInstance) this.chartInstance.destroy();
  this.chartInstance = new Chart(this.barCanvas.nativeElement, {
            type: 'bar',
            data: {
              labels: preds.map((p: PrediccionDia) => p.dia),
              datasets: [{
                data: vals,
                backgroundColor: vals.map((v: number) => v === max ? '#B8860B' : '#2a2510'),
                borderColor:     vals.map((v: number) => v === max ? '#d4a017' : '#3a3510'),
                borderWidth: 1,
                borderRadius: 6,
                label: 'Clientes estimados'
              }]
            },
            options: {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#1a1a1a',
      titleColor: '#D4AF37',
      bodyColor: '#aaa',
      callbacks: { label: (ctx: any) => ` ${ctx.raw} clientes estimados` }
    }
  },
  scales: {
    x: {
      ticks: { color: '#888', font: { size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
      border: { display: false }
    },
    y: {
      beginAtZero: true,
      ticks: { color: '#888', stepSize: 2, font: { size: 11 } },
      grid: { color: 'rgba(255,255,255,0.04)' },
      border: { display: false }
    }
  }
}
            
          });
        }, 100);
      },
      error: () => { this.loadingPrediccion = false; }
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
        error: () => { this.loadingCitas = false; }
      });
  }

  getNombreCompleto(cita: CitaBarberoResponseDTO): string {
    return `${cita.nombreCliente} ${cita.apellidoCliente}`.trim();
  }

  getServicioResumen(cita: CitaBarberoResponseDTO): string {
    if (!cita.servicios?.length) return '—';
    return cita.servicios.map((s: any) => s.nombreCorte).join(', ');
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

  trackByKpi(_: number, kpi: KpiCard): string                   { return kpi.label; }
  trackByCita(_: number, cita: CitaBarberoResponseDTO): number  { return cita.idReserva; }
}
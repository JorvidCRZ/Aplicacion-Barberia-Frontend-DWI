import { Component, OnInit, OnDestroy,  ViewChild, ElementRef, inject, ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { MetricaService } from '@/app/core/services/analisis/metrica.service';
import { ResumenMetricas, IngresoDiario, ReservasDia, RendimientoBarbero, ServicioSolicitado } from '@/app/core/models/analisis/metrica.model';

Chart.register(...registerables);

interface Kpi {
  label: string;
  value: string;
  sub: string;
  icon: string;
  porcentaje: number;
  deltaPositivo: boolean;
}
 
@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './metricas.html',
  // ✅ Sin styleUrl — todo el estilo va en Tailwind dentro del HTML
})
export class MetricasComponent implements OnInit, OnDestroy {
  private metricaService: MetricaService = inject(MetricaService);
  private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild('ventasChart')    ventasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reservasChart')  reservasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('barberosChart')  barberosRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('serviciosChart') serviciosRef!: ElementRef<HTMLCanvasElement>;

  private charts: Chart[] = [];

  fechaFin    = new Date().toISOString().split('T')[0];
  fechaInicio = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];

  cargando = false;
  error    = '';
  kpis: Kpi[] = [];

  private gold      = '#c9a84c';
  private goldSoft  = 'rgba(201,168,76,0.18)';
  private red       = '#e05252';
  private gridColor = 'rgba(255,255,255,0.06)';
  private textColor = 'rgba(255,255,255,0.55)';

  ngOnInit(): void { this.cargar(); }

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy()); }

  aplicarFiltros(): void { this.cargar(); }

private cargar(): void {
  this.cargando = true;
  this.error    = '';
  this.charts.forEach(c => c.destroy());
  this.charts   = [];

  forkJoin({
    resumen:   this.metricaService.getResumen(this.fechaInicio, this.fechaFin),
    ingresos:  this.metricaService.getIngresosDiarios(this.fechaInicio, this.fechaFin),
    reservas:  this.metricaService.getReservasPorDia(this.fechaInicio, this.fechaFin),
    barberos:  this.metricaService.getRendimientoBarberos(this.fechaInicio, this.fechaFin),
    servicios: this.metricaService.getServiciosSolicitados(this.fechaInicio, this.fechaFin),
  }).subscribe({
    next: ({ resumen, ingresos, reservas, barberos, servicios }) => {
      this.cargando = false;
      this.buildKpis(resumen);
      this.cdr.detectChanges(); 
      this.buildVentasChart(ingresos);
      this.buildReservasChart(reservas);
      this.buildBarberosChart(barberos);
      this.buildServiciosChart(servicios);
    },
    error: (err) => {
      this.cargando = false;
      this.error = err?.error?.message ?? 'Error al cargar métricas';
    }
  });
}

  private buildKpis(r: ResumenMetricas): void {
    this.kpis = [
      { label: 'Ingresos totales',  value: `S/ ${r.ingresosTotales.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, sub: 'En el período',            icon: 'dollar',     porcentaje: 0, deltaPositivo: true },
      { label: 'Reservas totales',  value: `${r.reservasTotales}`,  sub: 'Total del período',          icon: 'calendar',   porcentaje: 0, deltaPositivo: true },
      { label: 'Completadas',       value: `${r.completadas}`,      sub: `${r.reservasTotales ? ((r.completadas / r.reservasTotales) * 100).toFixed(0) : 0}% del total`, icon: 'check-circle', porcentaje: 0, deltaPositivo: true },
      { label: 'Clientes activos',  value: `${r.clientesActivos}`,  sub: 'Con reservas en período',    icon: 'users',      porcentaje: 0, deltaPositivo: true },
      { label: 'Clientes nuevos',   value: `${r.clientesNuevos}`,   sub: 'Primera reserva',            icon: 'user-plus',  porcentaje: 0, deltaPositivo: true },
      { label: 'Ticket promedio',   value: `S/ ${r.ticketPromedio.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`, sub: 'Por reserva completada', icon: 'chart-line', porcentaje: 0, deltaPositivo: true },
    ];
  }

  private buildVentasChart(data: IngresoDiario[]): void {
    const ctx = this.ventasRef.nativeElement.getContext('2d')!;
    this.charts.push(new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(d => d.fecha),
        datasets: [{ label: 'Ingresos (S/)', data: data.map(d => d.total), borderColor: this.gold, backgroundColor: this.goldSoft, borderWidth: 2, pointRadius: 3, pointBackgroundColor: this.gold, fill: true, tension: 0.4 }]
      },
      options: this.baseOptions('S/ ')
    }));
  }

  private buildReservasChart(data: ReservasDia[]): void {
    const ctx = this.reservasRef.nativeElement.getContext('2d')!;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.dia),
        datasets: [
          { label: 'Completadas', data: data.map(d => d.completadas), backgroundColor: this.gold, borderRadius: 6 },
          { label: 'Canceladas',  data: data.map(d => d.canceladas),  backgroundColor: this.red,  borderRadius: 6 }
        ]
      },
      options: this.baseOptions()
    }));
  }

  private buildBarberosChart(data: RendimientoBarbero[]): void {
    const ctx = this.barberosRef.nativeElement.getContext('2d')!;
    this.charts.push(new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.nombre),
        datasets: [{ label: 'Reservas', data: data.map(d => d.totalReservas), backgroundColor: data.map((_, i) => `rgba(201,168,76,${Math.max(1 - i * 0.12, 0.35)})`), borderRadius: 6 }]
      },
      options: { ...this.baseOptions(), indexAxis: 'y' as const }
    }));
  }

  private buildServiciosChart(data: ServicioSolicitado[]): void {
    const ctx = this.serviciosRef.nativeElement.getContext('2d')!;
    const colors = ['#c9a84c','#d4af37','#b8964b','#a07840','#e2c074','#8a6530','#f0d080','#6b4f25'];
    this.charts.push(new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.nombre),
        datasets: [{ data: data.map(d => d.cantidad), backgroundColor: colors.slice(0, data.length), borderColor: 'rgba(0,0,0,0)', borderWidth: 2 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { color: this.textColor, font: { size: 11 }, padding: 12 } },
          tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}` } }
        }
      }
    }));
  }

  private baseOptions(prefix = ''): any {
    return {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: this.textColor, font: { size: 11 } } },
        tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.dataset.label}: ${prefix}${ctx.parsed.y ?? ctx.parsed}` } }
      },
      scales: {
        x: { ticks: { color: this.textColor, font: { size: 11 } }, grid: { color: this.gridColor } },
        y: { ticks: { color: this.textColor, font: { size: 11 } }, grid: { color: this.gridColor } }
      }
    };
  }
}
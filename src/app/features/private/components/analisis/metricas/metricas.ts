import { Component, OnInit, OnDestroy, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { forkJoin } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { MetricaService } from '@/app/core/services/analisis/metrica.service';
import { FILTROS_METRICAS } from '@/app/core/config/filtros.config';
import { ResumenMetricas, IngresoDiario, ReservasDia, RendimientoBarbero, ServicioSolicitado, MetricasFiltro } from '@/app/core/models/analisis/metrica.model'
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { FilterField } from '@/app/core/models/common/filtro.model';
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
  imports: [CommonModule, FormsModule, TabsModule,FiltrosComponent],
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

// Filtro
filtro: MetricasFiltro = {
  fechaInicio: '',
  fechaFin: ''
};

// Configuración del componente de filtros
filtrosFields: FilterField<MetricasFiltro>[] = [...FILTROS_METRICAS];
texto = 'Métricas';

// Fechas usadas por el servicio
fechaInicio = '';
fechaFin = '';

// Estado
cargando = false;
error = '';

// KPIs
kpis: Kpi[] = [];

// Colores
private gold      = '#c9a84c';
private goldSoft  = 'rgba(201,168,76,0.18)';
private red       = '#e05252';
private gridColor = 'rgba(255,255,255,0.06)';
private textColor = 'rgba(255,255,255,0.55)';


ngOnInit(): void {
  const hoy = new Date();
  const hace30 = new Date();

  hace30.setDate(hoy.getDate() - 30);

  this.filtro = {
    fechaInicio: hace30.toISOString().split('T')[0],
    fechaFin: hoy.toISOString().split('T')[0]
  };

  this.fechaInicio = this.filtro.fechaInicio;
  this.fechaFin = this.filtro.fechaFin;

  this.cargar();
}

  ngOnDestroy(): void { this.charts.forEach(c => c.destroy());

   }

 onBuscar(filtros: Partial<MetricasFiltro>): void {
  this.filtro = {
    ...this.filtro,
    ...filtros
  };

  this.fechaInicio = this.filtro.fechaInicio;
  this.fechaFin = this.filtro.fechaFin;

  this.cargar();
}


onLimpiar(): void {

  const hoy = new Date();
  const hace30 = new Date();

  hace30.setDate(hoy.getDate() - 30);

  this.filtro = {
    fechaInicio: hace30.toISOString().split('T')[0],
    fechaFin: hoy.toISOString().split('T')[0]
  };

  this.fechaInicio = this.filtro.fechaInicio;
  this.fechaFin = this.filtro.fechaFin;

  this.cargar();
}



private cargar(): void {

  this.cargando = true;
  this.error = '';

  this.charts.forEach(c => c.destroy());
  this.charts = [];

  forkJoin({
    resumen: this.metricaService.getResumen(
      this.filtro.fechaInicio,
      this.filtro.fechaFin
    ),

    ingresos: this.metricaService.getIngresosDiarios(
      this.filtro.fechaInicio,
      this.filtro.fechaFin
    ),

    reservas: this.metricaService.getReservasPorDia(
      this.filtro.fechaInicio,
      this.filtro.fechaFin
    ),

    barberos: this.metricaService.getRendimientoBarberos(
      this.filtro.fechaInicio,
      this.filtro.fechaFin
    ),

    servicios: this.metricaService.getServiciosSolicitados(
      this.filtro.fechaInicio,
      this.filtro.fechaFin
    )

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

      this.error =
        err?.error?.message ??
        'Error al cargar métricas';
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
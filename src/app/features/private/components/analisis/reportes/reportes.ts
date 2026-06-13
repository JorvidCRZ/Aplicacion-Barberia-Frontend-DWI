import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ReporteService } from '@/app/core/services/analisis/reporte.service';
import { FilaSemanal, ReporteItem, EstadoReserva, MetodoPago, ReporteFiltro } from '@/app/core/models/analisis/reporte.model';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './reportes.html',
})
export class ReportesComponent implements OnInit, OnDestroy {

  private reporteSvc = inject(ReporteService);
  private destroy$   = new Subject<void>();

  filtro: ReporteFiltro = { desde: '', hasta: '' };

  cargando  = true;
  exportando = '';
  error      = '';

  resumenSemanal: FilaSemanal[] = [];
  totalReservas    = 0;
  totalCompletadas = 0;
  totalCanceladas  = 0;
  totalIngresos    = 0;

  barberos:  { id: number, nombre: string }[] = [];
  servicios: { id: number, nombre: string }[] = [];

  estados     = Object.values(EstadoReserva);
  metodosPago = Object.values(MetodoPago);

  reportes: ReporteItem[] = [
    { icon: 'calendar', titulo: 'Reservas',             descripcion: 'Reporte detallado de todas las reservas',  tipo: 'reservas' },
    { icon: 'dollar',   titulo: 'Ventas e ingresos',    descripcion: 'Análisis de ingresos y transacciones',     tipo: 'ventas'   },
    { icon: 'users',    titulo: 'Clientes',              descripcion: 'Base de datos y estadísticas de clientes', tipo: 'clientes' },
    { icon: 'wrench',   titulo: 'Actividad de barberos', descripcion: 'Rendimiento y métricas del equipo',        tipo: 'barberos' },
  ];

  ngOnInit(): void {
    const hoy   = new Date();
    const hace7 = new Date();
    hace7.setDate(hoy.getDate() - 7);
    this.filtro.hasta  = hoy.toISOString().split('T')[0];
    this.filtro.desde  = hace7.toISOString().split('T')[0];
    this.cargarDatos();
    this.cargarBarberos();
    this.cargarServicios();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.error    = '';
    this.reporteSvc
      .getResumenSemanal(this.filtro.desde, this.filtro.hasta)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.resumenSemanal = data;
          this.calcularTotales();
          this.cargando = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'No se pudo cargar el resumen semanal.';
          this.resumenSemanal = [];
          this.calcularTotales();
          this.cargando = false;
        },
      });
  }

  cargarBarberos(): void {
    this.reporteSvc.getBarberos().subscribe(data => this.barberos = data);
  }

  cargarServicios(): void {
    this.reporteSvc.getServicios().subscribe(data => this.servicios = data);
  }

  aplicarFiltros(): void {
    if (!this.filtro.desde || !this.filtro.hasta) {
      this.error = 'Seleccione un rango de fechas válido.';
      return;
    }
    this.cargarDatos();
  }

  limpiarFiltros(): void {
    const desde = this.filtro.desde;
    const hasta = this.filtro.hasta;
    this.filtro = { desde, hasta };
  }

  exportarPDF(tipo: string): void {
    this.exportando = `${tipo}-pdf`;
    this.reporteSvc.descargarArchivo(tipo, 'pdf', this.filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `${tipo}.pdf`; a.click();
          URL.revokeObjectURL(url);
          this.exportando = '';
        },
        error: () => { this.error = 'Error al descargar el PDF.'; this.exportando = ''; }
      });
  }

  exportarExcel(tipo: string): void {
    this.exportando = `${tipo}-excel`;
    this.reporteSvc.descargarArchivo(tipo, 'excel', this.filtro)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url; a.download = `${tipo}.xlsx`; a.click();
          URL.revokeObjectURL(url);
          this.exportando = '';
        },
        error: () => { this.error = 'Error al descargar el Excel.'; this.exportando = ''; }
      });
  }

  calcularTotales(): void {
    this.totalReservas    = this.resumenSemanal.reduce((s, f) => s + f.reservas,    0);
    this.totalCompletadas = this.resumenSemanal.reduce((s, f) => s + f.completadas, 0);
    this.totalCanceladas  = this.resumenSemanal.reduce((s, f) => s + f.canceladas,  0);
    this.totalIngresos    = this.resumenSemanal.reduce((s, f) => s + f.ingresos,    0);
  }

  private labelTipo(tipo: string): string {
    const map: Record<string, string> = {
      reservas: 'Reservas',
      ventas:   'Ventas e Ingresos',
      clientes: 'Clientes',
      barberos: 'Actividad de Barberos',
    };
    return map[tipo] ?? tipo;
  }
}
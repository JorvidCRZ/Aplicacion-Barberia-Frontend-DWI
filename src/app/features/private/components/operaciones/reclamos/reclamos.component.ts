import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { ReclamoTableComponent } from './reclamo-table/reclamo-table.component';
import { ReclamoFormComponent } from './reclamo-form/reclamo-form.component';
import { ReclamoActualizarComponent } from './reclamo-actualizar/reclamo-actualizar.component';
import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { DialogHeaderComponent } from '@/app/shared/components/dialog-header/dialog-header.component';
import { ReclamoService } from '@/app/core/services/operaciones/reclamo.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ReclamoFiltro } from '@/app/core/models/operaciones/reclamos-model/reclamo.filtro.model';
import { ReclamoRequest, ReclamoResponse, ReclamoSolucionRequest } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { FILTROS_RECLAMO } from '@/app/core/config/filtros.config';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { StatsComponent } from '@/app/shared/components/stats/stats.component';
import { RECLAMOS_STATS_CONFIG, StatsCard } from '@/app/core/models/common/card.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reclamos',
  imports: [CommonModule, ButtonModule, DialogModule,
    StatsComponent, FiltrosComponent,
    SearchBarComponent, DialogHeaderComponent,
    ReclamoTableComponent, ReclamoFormComponent, ReclamoActualizarComponent,
  ],
  templateUrl: './reclamos.html',
  styleUrl: './reclamos.css',
})

export class ReclamosComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private reclamoService = inject(ReclamoService);
  private notify = inject(NotificationService);

  filtrosReclamo = FILTROS_RECLAMO;
  reclamos: ReclamoResponse[] = [];
  statsCards: StatsCard[] = [];
  reclamoSeleccionado: ReclamoResponse | null = null;
  filtro: Partial<ReclamoFiltro> = {};
  mostrarFormulario = false;
  mostrarFormularioActualizar = false;
  cargado = false;
  totalRecords = 0;
  rows = 25;
  texto = 'Reclamos';
  icono = 'pi-exclamation-triangle';
  private pageActual = 0;

  ngOnInit(): void {
    this.cargarResumen();
    this.cargarReclamos(0, this.rows);
  }

  cargarReclamos(page: number, size: number): void {
    this.pageActual = page;
    this.cargado = false;
    this.reclamoService.listarReclamos({ ...this.filtro, page, size }).subscribe({
      next: (resp) => {
        this.reclamos = resp.data?.content ?? [];
        this.totalRecords = resp.data?.totalElements ?? 0;
        this.cargado = true;
        this.cdr.detectChanges();
      },
      error: (err) => { this.notify.showHttpError(err); this.cargado = true; }
    });
  }

  cargarResumen(): void {
    this.reclamoService.obtenerResumenReclamos().subscribe({
      next: (resp) => {
        const resumen = resp.data;
        this.statsCards = RECLAMOS_STATS_CONFIG.map(item => ({
          title: item.title,
          icon: item.icon,
          value: resumen[item.key] ?? 0,
          accentClass: item.accentClass,
          accentTextClass: item.accentTextClass,
          iconBgClass: item.iconBgClass,
        }));
      },
      error: (err) => this.notify.showHttpError(err)
    });
  }

  cargarDetalle(id: number): void {
    this.router.navigate(['/dashboard/admin/operaciones/reclamos', id]);
  }

  buscarReclamos(valor: string): void {
    this.filtro = valor ? { numeroReclamo: valor } : {};
    this.cargarReclamos(0, this.rows);
  }

  abrirCrear(): void { this.mostrarFormulario = true; }
  cerrarFormulario(): void { this.mostrarFormulario = false; }

  abrirActualizar(reclamo: ReclamoResponse): void {
    this.reclamoSeleccionado = reclamo;
    this.mostrarFormularioActualizar = true;
  }

  abrirVer(id: number) {
    this.cargarDetalle(id);
  }

  cerrarActualizar(): void {
    this.mostrarFormularioActualizar = false;
    this.reclamoSeleccionado = null;
  }

  guardarReclamo(data: { request: ReclamoRequest; archivos?: File[] }): void {
    this.reclamoService.crearReclamo(data.request, data.archivos).subscribe({
      next: () => {
        this.notify.showSuccess('Reclamo creado correctamente');
        this.cerrarFormulario();
        this.cargarReclamos(0, this.rows);
        this.cargarResumen();
      },
      error: (err) => this.notify.showHttpError(err)
    });
  }

  guardarActualizacion(data: ReclamoSolucionRequest): void {
    if (!this.reclamoSeleccionado) return;
    this.reclamoService.actualizarSolucionReclamo(this.reclamoSeleccionado.idReclamo, data).subscribe({
      next: () => {
        this.notify.showSuccess('Reclamo actualizado correctamente');
        this.cerrarActualizar();
        this.cargarReclamos(this.pageActual, this.rows);
        this.cargarResumen();
      },
      error: (err) => this.notify.showHttpError(err)
    });
  }

  eliminarReclamo(reclamo: ReclamoResponse): void {
    this.reclamoService.eliminarReclamo(reclamo.idReclamo).subscribe({
      next: () => {
        this.notify.showSuccess('Reclamo eliminado correctamente');
        this.cargarReclamos(this.pageActual, this.rows);
      },
      error: (err) => this.notify.showHttpError(err)
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.rows;
    this.cargarReclamos(first / rows, rows);
  }

  onBuscar(filtros: ReclamoFiltro): void {
    this.filtro = filtros;
    this.cargarReclamos(0, this.rows);
  }

  onLimpiar(): void {
    this.filtro = {};
    this.cargarReclamos(0, this.rows);
  }
}
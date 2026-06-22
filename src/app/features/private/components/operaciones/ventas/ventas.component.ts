import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent } from 'primeng/table';

import { VentaTableComponent } from './venta-table/venta-table.component';
import { VentaFormComponent } from './venta-form/venta-form.component';
import { VentaResumenComponent } from './venta-resumen/venta-resumen.component';

import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { DialogHeaderComponent } from '@/app/shared/components/dialog-header/dialog-header.component';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component'; 

import { NotificationService } from '@/app/core/services/common/notification.service';
import { VentaService } from '@/app/core/services/venta/venta.service';

import { Venta } from '@/app/core/models/ventas/venta.model';
import { VentaDetalle } from '@/app/core/models/ventas/detalle.model';
import { VentaFiltro } from '@/app/core/models/ventas/venta.model'; 
import { FILTROS_VENTA } from '@/app/core/config/filtros.config';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    VentaTableComponent,
    VentaFormComponent,
    VentaResumenComponent,
    SearchBarComponent,
    DialogHeaderComponent,
    FiltrosComponent 
  ],
  templateUrl: './ventas.html'
})
export class VentasComponent implements OnInit {

  private ventaService = inject(VentaService);
  private notify = inject(NotificationService);

  ventas: Venta[] = [];
  ventaSeleccionada: Venta | null = null;
  mostrarFormulario = false;

  rows = 25;
  totalRecords = 0;
  cargado = false;

  totalVentas = 0;
  ingresos = 0;
  promedio = 0;

  filtro: VentaFiltro = {};
  filtrosFields = FILTROS_VENTA; 

  ngOnInit(): void {
    this.cargarVentas(0, this.rows);
  }

  cargarVentas(page: number, size: number): void {
    this.cargado = false;
    
    this.filtro.page = page;
    this.filtro.size = size;

    this.ventaService.obtenerVentas(this.filtro).subscribe({
      next: (resp) => {
        this.ventas = resp.data.map((venta: Venta) => {

          const total = (venta.detalles ?? []).reduce(
            (acc: number, det: VentaDetalle) => acc + (det.subtotal ?? 0),
            0
          );

          return {
            ...venta,
            total
          };

        });
        this.calcularResumen();
        this.cargado = true;
      },
      error: () => {
        console.warn('Backend no disponible, manteniendo datos actuales.');
        this.cargado = true;
      }
    });
  }

  crearVenta(data: any): void {
    this.ventaService.crearVenta(data).subscribe({
      next: (resp) => {
        this.notify.showSuccess(resp.message);
        this.cargarVentas(0, this.rows);
        this.cerrarFormulario();
      },
      error: () => {
        console.warn('Backend no conectado, simulando creación en UI...');
        const idGenerado = Math.floor(Math.random() * 10000);
        const ventaSimulada: Venta = {
          ...data,
          ventaId: idGenerado,
          numeroCorrelativo: `VEN-SIM-${idGenerado}`, 
          fecha: new Date(),
          clienteNombre: data.clienteNombre ?? '',
          barberoNombre: 'Sin asignar',
          total: (data.detalles ?? []).reduce(
            (acc: number, det: any) => acc + (det.precioUnitario * det.cantidad), 0
          )
        } as unknown as Venta;

        this.ventas = [ventaSimulada, ...this.ventas];
        this.calcularResumen();
        this.notify.showSuccess('Venta registrada (Modo Simulación)');
        this.cerrarFormulario();
      }
    });
  }

  editarVentaGuardada(data: any): void {
    console.warn('Modo Simulación: editando venta en UI...');

    this.ventas = this.ventas.map(v =>
      v.ventaId === this.ventaSeleccionada!.ventaId
        ? {
          ...v,
          ...data,
          ventaId: v.ventaId,
          numeroCorrelativo: v.numeroCorrelativo, 
          clienteNombre: v.clienteNombre,
          total: (data.detalles ?? []).reduce(
            (acc: number, det: any) => acc + (det.precioUnitario * det.cantidad), 0
          )
        }
        : v
    );

    this.calcularResumen();
    this.notify.showSuccess('Venta actualizada (Modo Simulación)');
    this.cerrarFormulario();
  }

  eliminarVenta(venta: Venta): void {
    this.ventaService.eliminarVenta(venta.ventaId).subscribe({
      next: (resp) => {
        this.notify.showSuccess(resp.message);
        this.cargarVentas(0, this.rows);
      },
      error: () => {
        this.ventas = this.ventas.filter(v => v.ventaId !== venta.ventaId);
        this.calcularResumen();
      }
    });
  }

  guardarVenta(data: any): void {
    if (this.ventaSeleccionada) {
      this.editarVentaGuardada(data);
    } else {
      this.crearVenta(data);
    }
  }

  buscarVentas(filtrosAplicados: VentaFiltro): void {
    this.filtro = filtrosAplicados;
    this.cargarVentas(0, this.rows);
  }

  buscarPorTexto(valor: string): void {
    this.filtro = { cliente: valor }; 
    this.cargarVentas(0, this.rows);
  }

  limpiarFiltros(): void {
    this.filtro = {};
    this.cargarVentas(0, this.rows);
  }

  abrirCrearVenta(): void {
    this.ventaSeleccionada = null;
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  editarVenta(venta: Venta): void {
    this.ventaSeleccionada = venta;
    this.mostrarFormulario = true;
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 25;
    this.cargarVentas(Math.floor(first / rows), rows);
  }

  calcularResumen(): void {
    this.totalVentas = this.ventas.length;
    this.ingresos = this.ventas.reduce((acc, venta) => {
      return acc + (venta.detalles ?? []).reduce(
        (sum, det) => sum + (Number(det.precioUnitario) * Number(det.cantidad)), 0
      );
    }, 0);
    this.promedio = this.totalVentas > 0 ? this.ingresos / this.totalVentas : 0;
  }
}
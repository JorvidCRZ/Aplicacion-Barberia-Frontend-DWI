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

import { NotificationService } from '@/app/core/services/common/notification.service';
import { VentaService } from '@/app/core/services/venta/venta.service';

import { Venta } from '@/app/core/models/ventas/venta.model';

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
    DialogHeaderComponent
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

  filtro = '';

  ngOnInit(): void {
    this.cargarVentas(0, this.rows);
  }

  cargarVentas(page: number, size: number): void {

    this.cargado = false;

    this.ventaService.obtenerVentas()
      .subscribe({

        next: (resp) => {

          this.ventas = resp.data.map((venta) => {

            const total = (venta.detalles ?? []).reduce((acc, det) => {

              return acc + ((det.subtotal ?? 0));

            }, 0);

            return {
              ...venta,
              total
            };

          });

          this.calcularResumen();

          this.cargado = true;
        },

        error: (err) => {

          this.notify.showHttpError(err);

          this.cargado = true;
        }

      });

  }

  buscarVentas(valor: string): void {

    this.filtro = valor;

    this.cargarVentas(0, this.rows);

  }

  abrirCrearVenta(): void {

    this.ventaSeleccionada = null;

    this.mostrarFormulario = true;

  }


  cerrarFormulario(): void {

    this.mostrarFormulario = false;


  }

  guardarVenta(data: Venta): void {

    this.crearVenta(data);

  }

  crearVenta(data: Venta): void {

    this.ventaService.crearVenta(data)
      .subscribe({

        next: (resp) => {

          this.notify.showSuccess(resp.message);

          this.cargarVentas(0, this.rows);

          this.cerrarFormulario();

        },

        error: (err) => {
          this.notify.showHttpError(err);
        }

      });

  }

  editarVenta(venta: Venta): void {

  this.ventaSeleccionada = venta;

  this.mostrarFormulario = true;

}


  eliminarVenta(venta: Venta): void {

    this.ventaService.eliminarVenta(venta.ventaId)
      .subscribe({

        next: (resp) => {

          this.notify.showSuccess(resp.message);

          this.cargarVentas(0, this.rows);

        },

        error: (err) => {

          this.notify.showHttpError(err);

        }

      });

  }

  onLazyLoad(event: TableLazyLoadEvent): void {

    const first = event.first ?? 0;

    const rows = event.rows ?? 25;

    const page = Math.floor(first / rows);

    this.cargarVentas(page, rows);

  }

  calcularResumen(): void {

    this.totalVentas = this.ventas.length;

    this.ingresos = this.ventas
      .reduce((acc, venta) => {

        const detalles = venta.detalles ?? [];

        const totalVenta = detalles.reduce((sum, det) => {
          return sum + (det.precioUnitario * det.cantidad);
        }, 0);

        return acc + totalVenta;

      }, 0);

    this.promedio = this.totalVentas > 0
      ? this.ingresos / this.totalVentas
      : 0;

  }

}
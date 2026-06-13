import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';

import { PagoService } from '../../../../../core/services/pagos/pago.service';
import { NotificationService } from '../../../../../core/services/common/notification.service';
import { PagoResponse } from '../../../../../core/models/pagos/pago.model';

import { PagoFormComponent } from './pago-form/pago-form.component';
import { HistorialPagoComponent } from './historial-pago/historial-pago.component';
import { PagoDetalleComponent } from './pago-detalle/pago-detalle.component';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, DialogModule, ButtonModule, DatePickerModule, SelectModule, PagoFormComponent, HistorialPagoComponent, PagoDetalleComponent],
  templateUrl: './pagos.component.html',
 
})

export class PagosComponent implements OnInit {
  private readonly pagoService = inject(PagoService);
  private readonly notificationService = inject(NotificationService);

  pagos = signal<PagoResponse[]>([]);
  loading = signal<boolean>(false);
  totalRegistros = signal<number>(0);
  
  filtros = signal({ cliente: '' });
  resumen = signal({ totalHoy: 0, montoTotal: 0 });

  formVisible = signal<boolean>(false);
  detalleVisible = signal<boolean>(false);
  historialVisible = signal<boolean>(false);
  selectedPagoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarPagos();
  }

  cargarPagos(): void {
    this.loading.set(true);
    
    const clienteFilter = this.filtros().cliente !== '' ? this.filtros().cliente : undefined;
    
    this.pagoService.getPagos(clienteFilter).subscribe({
      next: (res) => {
        try {
          if (res.success && res.data) {
            this.pagos.set(res.data);
            this.totalRegistros.set(res.data.length);
            this.calcularResumen(res.data);
          }
        } catch (err) {
          console.error("Error procesando los datos:", err);
        } finally {
          this.loading.set(false);
        }
      },
      error: () => {
        this.notificationService.showError('Error al cargar la lista de pagos');
        this.loading.set(false);
      }
    });
  }

  aplicarFiltros(): void { this.cargarPagos(); }
  
  limpiarFiltros(): void {
    this.filtros.set({ cliente: '' });
    this.cargarPagos();
  }

 calcularResumen(lista: PagoResponse[]): void {
    const hoyStr = new Date().toISOString().split('T')[0];
    let hoyCount = 0, totalMonto = 0;
    
    lista.forEach(p => {
      if (p.fecha && p.fecha.startsWith(hoyStr)) {
        hoyCount++;
      }
      totalMonto += (p.monto || 0); 
    });
    
    this.resumen.set({ totalHoy: hoyCount, montoTotal: totalMonto });
  }

  abrirNuevoPago(): void { this.formVisible.set(true); }
  verDetalle(id: number): void { this.selectedPagoId.set(id); this.detalleVisible.set(true); }
  verHistorial(id: number): void { this.selectedPagoId.set(id); this.historialVisible.set(true); }

  onPagoGuardado(nuevoPago: PagoResponse): void {
    this.formVisible.set(false);
    this.cargarPagos();
    this.notificationService.showSuccess('Pago registrado correctamente');
  }

  onPagoActualizado(): void {
    this.detalleVisible.set(false);
    this.cargarPagos();
  }
}
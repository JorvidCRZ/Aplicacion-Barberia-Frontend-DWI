import { Component, Input, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { PagoService } from '../../../../../../core/services/pagos/pago.service';
import { NotificationService } from '../../../../../../core/services/common/notification.service';
import { PagoResponse } from '../../../../../../core/models/pagos/pago.model';
import { HistorialPagoComponent } from '../historial-pago/historial-pago.component';
import { ConfirmPopoverComponent } from '../../../../../../shared/components/confirm-popover/confirm-popover.component';

@Component({
  selector: 'app-pago-detalle',
  standalone: true,
  imports: [CommonModule, DialogModule, HistorialPagoComponent, ConfirmPopoverComponent],
  templateUrl: './pago-detalle.component.html'
})
export class PagoDetalleComponent implements OnInit {
  private readonly pagoService = inject(PagoService);
  private readonly notificationService = inject(NotificationService);

  @Input({ required: true }) pagoId!: number;
  @Output() onCerrar = new EventEmitter<void>();
  @Output() onActualizado = new EventEmitter<void>();

  pago = signal<PagoResponse | null>(null);
  loadingAction = signal<boolean>(false);
  innerHistorialVisible = signal<boolean>(false);
  
  confirmVisible = signal<boolean>(false);

  ngOnInit(): void { if (this.pagoId) this.cargarDetalle(); }

  cargarDetalle(): void {
    this.pagoService.getPagoById(this.pagoId).subscribe({ next: (res) => { if (res.success) this.pago.set(res.data!); } });
  }

  solicitarAnulacion(): void {
    this.confirmVisible.set(true);
  }

  ejecutarEliminacion(): void {
    this.confirmVisible.set(false); 
    this.loadingAction.set(true);
    
    this.pagoService.eliminarPago(this.pagoId).subscribe({
      next: (res) => { 
        if (res.success) { 
          this.notificationService.showSuccess('Pago eliminado.'); 
          this.onActualizado.emit(); 
        } 
        this.loadingAction.set(false); 
      },
      error: () => this.loadingAction.set(false)
    });
  }

  abrirSubHistorial(): void { this.innerHistorialVisible.set(true); }
}
import { Component, Input, OnInit, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagoService } from '../../../../../../core/services/pagos/pago.service';
import { HistorialPagoResponse, PagoResponse } from '../../../../../../core/models/pagos/pago.model';

@Component({
  selector: 'app-historial-pago',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-pago.component.html'
})
export class HistorialPagoComponent implements OnInit {
  private readonly pagoService = inject(PagoService);
  @Input({ required: true }) pagoId!: number;
  @Output() onCerrar = new EventEmitter<void>();

  pagoInfo = signal<PagoResponse | null>(null);
  timelineEventos = signal<HistorialPagoResponse[]>([]);
  loadingData = signal<boolean>(false);

  ngOnInit(): void { if (this.pagoId) this.cargarAuditoria(); }

  cargarAuditoria(): void {
    this.loadingData.set(true);
    this.pagoService.getPagoById(this.pagoId).subscribe({ next: (res) => { if (res.success) this.pagoInfo.set(res.data!); } });
    this.pagoService.getHistorialPorPago(this.pagoId).subscribe({
      next: (res) => { if (res.success) this.timelineEventos.set(res.data!); this.loadingData.set(false); },
      error: () => this.loadingData.set(false)
    });
  }

  getIconData(descripcion: string): { icon: string, colorClass: string } {
    const desc = descripcion.toUpperCase();
    if (desc.includes('CREAT') || desc.includes('REGISTR')) return { icon: 'pi-plus-circle', colorClass: 'text-[#C9A84C] border-[#C9A84C]' };
    if (desc.includes('COMPLET') || desc.includes('APROB')) return { icon: 'pi-check-circle', colorClass: 'text-green-500 border-green-500' };
    if (desc.includes('ANUL') || desc.includes('ELIMIN')) return { icon: 'pi-times-circle', colorClass: 'text-red-500 border-red-500' };
    return { icon: 'pi-info-circle', colorClass: 'text-[#888] border-[#888]' };
  }
}
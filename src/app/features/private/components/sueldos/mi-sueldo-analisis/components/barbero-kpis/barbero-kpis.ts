import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenBarbero } from '@core/models/planilla/venta-barbero.model';

@Component({
  selector: 'app-barbero-kpis',
  imports: [CommonModule],
  templateUrl: './barbero-kpis.html',
  styleUrl: './barbero-kpis.css',
})
export class BarberoKpis {
  @Input() resumen!: ResumenBarbero;

  get ticketPromedio(): number {
    if (!this.resumen?.cantidadVentas) return 0;
    return this.resumen.totalVentas / this.resumen.cantidadVentas;
  }
}
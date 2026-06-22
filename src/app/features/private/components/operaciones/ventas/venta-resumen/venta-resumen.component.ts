import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-venta-resumen',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './venta-resumen.html'
})
export class VentaResumenComponent {
  @Input() totalVentas = 0;
  @Input() ingresos = 0;
  @Input() promedio = 0;
}
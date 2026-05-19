import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-venta-resumen',
  standalone: true,
  templateUrl: './venta-resumen.html'
})
export class VentaResumenComponent {

  @Input() totalVentas = 0;

  @Input() ingresos = 0;

  @Input() promedio = 0;

}
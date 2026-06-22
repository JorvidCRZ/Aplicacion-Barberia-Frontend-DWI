import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ResumenCard {
  icon: string;
  label: string;
  value: string;
  sub: string;
  color: 'white' | 'gold' | 'green';
}

@Component({
  selector: 'app-resumen-periodo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-periodo.html',
  styleUrls: ['./resumen-periodo.css']
})
export class ResumenPeriodoComponent {
  @Input() totalPlanilla: number = 0;
  @Input() totalComisiones: number = 0;
  @Input() sueldoFinalTotal: number = 0;
  @Input() ventasPeriodo: number = 0;
  @Input() barberosActivos: number = 0;
  @Input() totalBarberos: number = 0;

  get cards(): ResumenCard[] {
    return [
      {
        icon: 'ti-receipt',
        label: 'Total planilla',
        value: `S/ ${this.totalPlanilla.toLocaleString()}`,
        sub: `${this.totalBarberos} barberos`,
        color: 'white'
      },
      {
        icon: 'ti-coin',
        label: 'Total comisiones',
        value: `S/ ${this.totalComisiones.toLocaleString()}`,
        sub: 'Sobre ventas del período',
        color: 'gold'
      },
      {
        icon: 'ti-wallet',
        label: 'Sueldo final total',
        value: `S/ ${this.sueldoFinalTotal.toLocaleString()}`,
        sub: 'Planilla + comisiones',
        color: 'green'
      },
      {
        icon: 'ti-scissors',
        label: 'Ventas del período',
        value: `${this.ventasPeriodo}`,
        sub: 'Servicios realizados',
        color: 'white'
      },
      {
        icon: 'ti-users',
        label: 'Barberos activos',
        value: `${this.barberosActivos}`,
        sub: `De ${this.totalBarberos} en nómina`,
        color: 'white'
      }
    ];
  }
}
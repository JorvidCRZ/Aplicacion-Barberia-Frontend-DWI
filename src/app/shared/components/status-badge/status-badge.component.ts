import { CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  template: `<span [ngClass]="badgeClass">{{ label }}</span>`,



})
export class StatusBadgeComponent {
  @Input({ required: true }) value!: boolean | string | number;
  @Input() type: 'boolean' | 'text' | 'range' | 'array' | 'category' = 'boolean';
  @Input() trueLabel: string = 'Activo';
  @Input() falseLabel: string = 'Inactivo';
  @Input() warningLimit: number = 10;


  get label(): string {
    if (this.type === 'category') {
      const value = String(this.value);
      if (value === CategoriaTipo.PRODUCTO) return 'estado-producto';
      if (value === CategoriaTipo.SERVICIO) return 'estado-servicio';
      return 'estado-default';
    }

    if (this.type === 'boolean') { return Boolean(this.value) ? this.trueLabel : this.falseLabel; }
    return String(this.value);
  }

  get badgeClass(): string {
    switch (this.type) {
      case 'boolean': return Boolean(this.value) ? 'badge-activo' : 'badge-inactivo';
      case 'text': {
        const estado = String(this.value).toLowerCase();
        const clases: Record<string, string> = {
          producto: 'estado-producto',
          servicio: 'estado-servicio',

          confirmada: 'estado-confirmada',
          finalizada: 'estado-finalizada',
          cancelada: 'estado-cancelada',
          no_asistio: 'estado-no_asistio',

          activa: 'estado-activa',
          anulado: 'estado-anulado',
          anulada: 'estado-anulado',
          emitido: 'estado-emitido',
          emitida: 'estado-emitido',
        };

        return `badge-text ${clases[estado] || 'estado-default'}`;
      }

      case 'array':
        return 'badge-rol';

      case 'range': {
        const num = Number(this.value);

        if (num === 0) return 'badge-stock-cero';
        if (num <= this.warningLimit) return 'badge-stock-bajo';

        return 'badge-stock-ok';
      }

      default:
        return 'badge-base';
    }

  }
}

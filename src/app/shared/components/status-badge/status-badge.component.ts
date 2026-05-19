import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  imports: [CommonModule],
  template: `<span [ngClass]="badgeClass">{{ label }}</span>`,
})
export class StatusBadgeComponent {
  @Input({ required: true }) value!: boolean | string | number;
  @Input() type: 'boolean' | 'text' | 'range' | 'array' = 'boolean';
  @Input() trueLabel: string = 'Activo';
  @Input() falseLabel: string = 'Inactivo';
  @Input() warningLimit: number = 10;


  get label(): string {
    if (this.type === 'boolean') { return Boolean(this.value) ? this.trueLabel : this.falseLabel; }
    return String(this.value);
  }

  get badgeClass(): string {
    switch (this.type) {
      case 'boolean':
        return Boolean(this.value) ? 'badge-activo' : 'badge-inactivo';
      case 'text': {
        let base = 'badge-text';
        const estado = String(this.value).toLowerCase();
        if (estado === 'activa') {
          return base + ' estado-activa';
        }
        if (estado === 'anulado' || estado === 'anulada') {
          return base + ' estado-anulado';
        }
        if (estado === 'emitido' || estado === 'emitida') {
          return base + ' estado-emitido';
        }
        if (estado === 'producto') {
          return base + ' estado-producto';
        }
        if (estado === 'servicio') {
          return base + ' estado-servicio';
        }

        return base;
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

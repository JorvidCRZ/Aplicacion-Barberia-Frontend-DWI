import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dialog-header',
  imports: [CommonModule],
  template: `
    <div class="dialog-header-base" [ngClass]="headerClass">
      <i [class]="getIconClass()"></i>
      <span>{{ title }}</span>
    </div>
  `,
})
export class DialogHeaderComponent {
  @Input() title: string = '';
  @Input() icono: string = 'pi-user-edit';
  @Input() mode: 'crear' | 'editar' | 'eliminar' | 'anular' = 'crear';
  getIconClass(): string {
    let icon = this.icono?.trim() || '';
    if (!icon.startsWith('pi-')) {icon = 'pi-' + icon;}
    return `pi ${icon} text-xl`;
  }

  get headerClass(): string {
    switch (this.mode) {
      case 'editar': return 'dialog-header-editar';
      case 'eliminar': return 'dialog-header-eliminar';
      case 'anular': return 'dialog-header-anular';
      default: return 'dialog-header-crear';
    }
  }
}

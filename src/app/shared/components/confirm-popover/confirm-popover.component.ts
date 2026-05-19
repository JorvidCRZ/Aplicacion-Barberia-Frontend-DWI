import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DialogHeaderComponent } from '../dialog-header/dialog-header.component';

@Component({
  selector: 'app-confirm-popover',
  imports: [ButtonModule, PanelModule, DialogHeaderComponent],
  templateUrl: './confirm-popover.html'
})
export class ConfirmPopoverComponent {

  @Input() visible = false;
  @Input() mensaje: string = '';
  @Input() confirmText: string = 'Eliminar';
  @Input() cancelText: string = 'Cancelar';
  @Input() titulo: string = '';
  @Input() icono: string = 'pi-trash';
  @Input() mode: 'eliminar' | 'anular' = 'eliminar';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() anular = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  obtenerIcono() {
    return this.icono?.trim() || 'pi-trash';
  }

  obtenerTitulo() {
    if (this.titulo)
      return this.titulo;
    return 'Eliminar';
  }
}

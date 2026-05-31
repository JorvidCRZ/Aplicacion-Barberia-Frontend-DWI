import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-filtrar-barbero',
  imports: [ButtonModule],
  templateUrl: './filtrar-barbero.html',
  styleUrl: './filtrar-barbero.css',
})
export class FiltrarBarbero {
  @Output() apply = new EventEmitter<{ estado: string; order: string }>();
  @Output() clear = new EventEmitter<void>();
  @Output() inhabilitados = new EventEmitter<void>();

  onApply(estado: string, order: string) { this.apply.emit({ estado, order }); }
  onClear(statusSelect: HTMLSelectElement, orderSelect: HTMLSelectElement) {
    statusSelect.value = '';
    orderSelect.value = '';
    this.clear.emit();
  }

  onInhabilitados() {
    this.inhabilitados.emit();
  }

}

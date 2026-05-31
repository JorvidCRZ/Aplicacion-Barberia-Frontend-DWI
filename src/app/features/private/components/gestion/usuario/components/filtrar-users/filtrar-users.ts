import { Component, EventEmitter, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

export interface FiltroUsuario {
  rol: string;
  tipo: string;
  qr: string;
  cantidadRoles: string;
}

@Component({
  selector: 'app-filtrar-users',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './filtrar-users.html',
  styleUrl: './filtrar-users.css',
})
export class FiltrarUsers {
  @Output() apply = new EventEmitter<FiltroUsuario>();
  @Output() clear = new EventEmitter<void>();

  onApply(rol: string, qr: string, cantidadRoles: string): void {
    this.apply.emit({
      rol, qr, cantidadRoles,
      tipo: ''
    });
  }

  onClear(
    rolSelect: HTMLSelectElement,
    qrSelect: HTMLSelectElement,
    cantidadRolesSelect: HTMLSelectElement,
  ): void {
    rolSelect.value = '';
    qrSelect.value = '';
    cantidadRolesSelect.value = '';
    this.clear.emit();
  }

}

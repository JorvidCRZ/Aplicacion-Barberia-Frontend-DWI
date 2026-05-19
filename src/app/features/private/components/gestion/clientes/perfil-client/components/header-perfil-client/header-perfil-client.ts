import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-perfil-client',
  standalone: true,
  imports: [],
  templateUrl: './header-perfil-client.html',
  styleUrl: './header-perfil-client.css',
})
export class HeaderPerfilClient {
  @Input() clienteNombre: string = 'Cliente';
  @Input() clienteIniciales: string = 'CL';
  @Input() clienteDescripcion: string = 'Perfil del cliente';

  volver(): void {
    window.history.back();
  }
}
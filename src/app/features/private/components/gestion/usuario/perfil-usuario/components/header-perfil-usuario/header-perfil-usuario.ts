import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-perfil-usuario',
  standalone: true,
  imports: [],
  templateUrl: './header-perfil-usuario.html',
  styleUrl: './header-perfil-usuario.css',
})
export class HeaderPerfilUsuario {

  @Input() usuarioNombre = 'Usuario';
  @Input() usuarioIniciales = 'US';
  @Input() usuarioDescripcion = 'Sin descripción disponible';
  @Input() volver: () => void = () => window.history.back();

}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { HeaderPerfilUsuario } from './components/header-perfil-usuario/header-perfil-usuario';
import { DatosBasicosPerfilUsuario } from './components/datos-basicos-perfil-usuario/datos-basicos-perfil-usuario';
import { CredencialesPerfilUsuario } from './components/credenciales-perfil-usuario/credenciales-perfil-usuario';
import { RolesPermisosPerfilUsuario } from './components/roles-permisos-perfil-usuario/roles-permisos-perfil-usuario';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, HeaderPerfilUsuario, RolesPermisosPerfilUsuario, DatosBasicosPerfilUsuario, CredencialesPerfilUsuario],
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.css',
})
export class PerfilUsuario implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificationService = inject(NotificationService);

  usuarioNombre = 'Usuario';
  usuarioIniciales = 'US';
  usuarioDescripcion = 'Sin descripción disponible';
  usuarioId: number = 0;
  personaId: number = 0;
  nombre = '—';
  apellido = '—';
  telefono = '—';
  email = '—';
  usuario = 'No disponible';
  contrasena = 'No disponible';
  cargando = false;
  errorCarga = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = parseInt(id, 10) || 0;
      this.cargarUsuario(this.usuarioId);
    }
  }

  private cargarUsuario(id: number): void {
    if (!id) {
        this.errorCarga = 'No se encontró el usuario solicitado.';
        return;
    }

    this.cargando = true;
    this.errorCarga = '';

    this.usuarioService.obtenerPorId(id).subscribe({
        next: (response) => {
            const data: any = response?.data ?? {};

            // ✅ El response es plano: { idUsuario, username, nombre, apellido, email, telefono, rol }
            this.usuarioId  = Number(data?.idUsuario ?? id);
            this.nombre     = data?.nombre    ?? '—';
            this.apellido   = data?.apellido  ?? '—';
            this.telefono   = data?.telefono  ?? '—';
            this.email      = data?.email     ?? '—';
            this.usuario    = data?.username  ?? 'No disponible';
            this.contrasena = 'No disponible'; // el response no trae password

            const nombreCompleto = [this.nombre, this.apellido].filter(Boolean).join(' ').trim();
            this.usuarioNombre     = nombreCompleto || this.usuario || `Usuario ${id}`;
            this.usuarioIniciales  = this.getInitials(this.usuarioNombre);
            this.usuarioDescripcion = `ID usuario: ${this.usuarioId}`;
            this.cargando = false;
        },
        error: () => {
            this.cargando = false;
            this.errorCarga = 'No se pudo cargar el perfil del usuario.';
            this.notificationService.showError(this.errorCarga);
        },
    });
}

  private getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return 'US';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  private maskPassword(password: string): string {
    if (!password) return 'No disponible';
    if (password.length <= 4) return password;
    const maskedLength = Math.min(Math.max(password.length - 4, 8), 16);
    return `${'•'.repeat(maskedLength)}${password.slice(-4)}`;
  }

  

  volver = () => window.history.back();

}

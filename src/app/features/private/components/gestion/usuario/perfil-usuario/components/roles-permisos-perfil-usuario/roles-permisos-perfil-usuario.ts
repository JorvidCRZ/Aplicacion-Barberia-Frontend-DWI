import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AssignRolesRequest, Rol, Permiso } from '@/app/core/models/gestion/usuario.model';
import { Page } from '@/app/core/models/common/index.model';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

interface PermisoConOrigen {
  permiso: Permiso;
  roles: string[];
}

@Component({
  selector: 'app-roles-permisos-perfil-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permisos-perfil-usuario.html',
  styleUrl: './roles-permisos-perfil-usuario.css',
})
export class RolesPermisosPerfilUsuario implements OnInit, OnChanges {

  private readonly usuarioService = inject(UsuarioService);
  private readonly notification = inject(NotificationService);

  @Input() usuarioId!: number;

  todosLosRoles: Rol[] = [];
  rolesAsignados: Rol[] = [];
  permisosActivos: PermisoConOrigen[] = [];
  rolesDisponibles: Rol[] = [];

  // Paginación permisos
  paginaPermisos = 0;
  tamañoPermisos = 5;
  totalPermisos = 0;
  totalPaginasPermisos = 0;

  cargando = false;
  showModalAgregarRol = false;
  rolesSeleccionados: Set<number> = new Set();

  // ─── Helpers ────────────────────────────────────────────────────────────────

  recalcularDisponibles(): void {
    const asignadosIds = new Set(this.rolesAsignados.map(r => r.idRol));
    this.rolesDisponibles = this.todosLosRoles.filter(r => !asignadosIds.has(r.idRol));
  }

  construirPermisosConOrigen(permisos: Permiso[]): void {
    const nombresRoles = this.rolesAsignados.map(r => r.nombre);
    this.permisosActivos = permisos.map(permiso => ({
      permiso,
      roles: nombresRoles,
    }));
  }

  recargarPermisos(): void {
    this.usuarioService
      .obtenerPermisosUsuario(this.usuarioId, this.paginaPermisos, this.tamañoPermisos)
      .subscribe({
        next: (res) => {
          const page = res.data as unknown as Page<Permiso>;
          this.construirPermisosConOrigen(page?.content ?? []);
          this.totalPermisos        = page?.totalElements ?? 0;
          this.totalPaginasPermisos = page?.totalPages    ?? 0;
        },
        error: (err) => this.notification.showHttpError(err, 'Actualizar permisos'),
      });
  }

  cambiarPaginaPermisos(pagina: number): void {
    this.paginaPermisos = pagina;
    this.recargarPermisos();
  }

  // ─── Lifecycle ───────────────────────────────────────────────────────────────

  ngOnInit(): void { this.cargarDatos(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['usuarioId'] && !changes['usuarioId'].firstChange) {
      this.cargarDatos();
    }
  }

  // ─── Métodos principales ─────────────────────────────────────────────────────

  cargarDatos(): void {
    if (!this.usuarioId) return;
    this.cargando = true;

    forkJoin({
      todos:     this.usuarioService.listarRoles(),
      asignados: this.usuarioService.obtenerRolesUsuario(this.usuarioId),
      permisos:  this.usuarioService.obtenerPermisosUsuario(this.usuarioId, 0, this.tamañoPermisos),
    }).subscribe({
      next: ({ todos, asignados, permisos }) => {
        this.todosLosRoles  = todos.data     ?? [];
        this.rolesAsignados = asignados.data ?? [];

        const page = permisos.data as unknown as Page<Permiso>;
        this.totalPermisos        = page?.totalElements ?? 0;
        this.totalPaginasPermisos = page?.totalPages    ?? 0;

        this.recalcularDisponibles();
        this.construirPermisosConOrigen(page?.content ?? []);
        this.cargando = false;
      },
      error: (err) => {
        this.notification.showHttpError(err, 'Cargar roles y permisos');
        this.cargando = false;
      },
    });
  }

  quitarRol(idRol: number): void {
    if (!this.usuarioId) return;

    const rolesPrevios = [...this.rolesAsignados];
    this.rolesAsignados = this.rolesAsignados.filter(r => r.idRol !== idRol);
    this.recalcularDisponibles();

    this.usuarioService.quitarRol(this.usuarioId, idRol).subscribe({
      next: (res) => {
        this.paginaPermisos = 0;
        this.recargarPermisos();
        this.notification.showSuccess(res?.message || 'Rol quitado correctamente');
      },
      error: (err) => {
        this.rolesAsignados = rolesPrevios;
        this.recalcularDisponibles();
        this.notification.showHttpError(err, 'Quitar rol');
      },
    });
  }

  abrirModalRol(): void {
    this.rolesSeleccionados = new Set();
    this.recalcularDisponibles();
    this.showModalAgregarRol = true;
  }

  toggleRol(idRol: number): void {
    this.rolesSeleccionados.has(idRol)
      ? this.rolesSeleccionados.delete(idRol)
      : this.rolesSeleccionados.add(idRol);
  }

  confirmarAgregarRoles(): void {
    if (!this.usuarioId || this.rolesSeleccionados.size === 0) return;
    const nuevosIds = Array.from(this.rolesSeleccionados);

    this.usuarioService.asignarRoles(this.usuarioId, { roles: nuevosIds }).subscribe({
      next: (res) => {
        const yaExistentes = new Set(this.rolesAsignados.map(r => r.idRol));
        const nuevos = this.todosLosRoles.filter(
          r => nuevosIds.includes(r.idRol) && !yaExistentes.has(r.idRol)
        );
        this.rolesAsignados = [...this.rolesAsignados, ...nuevos];
        this.recalcularDisponibles();
        this.paginaPermisos = 0;
        this.recargarPermisos();
        this.showModalAgregarRol = false;
        this.notification.showSuccess(res?.message || 'Roles asignados correctamente');
      },
      error: (err) => this.notification.showHttpError(err, 'Asignar roles'),
    });
  }
}
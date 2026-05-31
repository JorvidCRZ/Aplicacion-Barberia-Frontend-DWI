import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// ─── DTOs / modelos mínimos que necesita este componente ──────────────────────
// Ajusta las rutas de importación a la estructura real de tu proyecto

export interface PerfilUsuarioDTO {
  idUsuario: number;
  usuario: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  roles: string[];
}

export interface ActualizarPerfilDTO {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

export interface CambiarPasswordDTO {
  passwordActual: string;
  passwordNueva: string;
  confirmarPassword: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    TagModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})
export class Configuracion implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);

  // ── Estado ─────────────────────────────────────────────────────────────────

  cargando = signal(false);
  guardandoPerfil = signal(false);
  guardandoPassword = signal(false);
  mostrarPasswordActual = signal(false);
  mostrarPasswordNueva = signal(false);
  mostrarConfirmar = signal(false);

  perfil: PerfilUsuarioDTO = {
    idUsuario: 1,
    usuario: 'admin1',
    nombre: 'Admin',
    apellido: 'Sistema',
    telefono: '900000000',
    email: 'admin@gmail.com',
    roles: ['admin'],
  };

  // ── Formularios ────────────────────────────────────────────────────────────

  formPerfil!: FormGroup;
  formPassword!: FormGroup;

  // ── Ciclo de vida ──────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.initForms();
    this.cargarPerfil();
  }

  // ── Inicialización ─────────────────────────────────────────────────────────

  private initForms(): void {
    this.formPerfil = this.fb.group({
      nombre:   [this.perfil.nombre,   [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellido: [this.perfil.apellido, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      usuario:  [{ value: this.perfil.usuario, disabled: true }],
      telefono: [this.perfil.telefono, [Validators.pattern(/^\d{9,15}$/)]],
      email:    [this.perfil.email,    [Validators.required, Validators.email]],
    });

    this.formPassword = this.fb.group(
      {
        passwordActual:   ['', [Validators.required, Validators.minLength(6)]],
        passwordNueva:    ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword:['', [Validators.required]],
      },
      { validators: this.passwordsCoinciden }
    );
  }

  // ── Carga del perfil (reemplazar con llamada real al servicio) ─────────────

  cargarPerfil(): void {
    this.cargando.set(true);

    // TODO: reemplazar con tu servicio real, ej:
    // this.usuarioService.getMiPerfil().subscribe({ next: (data) => { ... } })

    // Simulación: en tu proyecto real elimina este setTimeout
    setTimeout(() => {
      // El perfil ya está seteado como mock arriba; aquí parchearías el form:
      this.formPerfil.patchValue({
        nombre:   this.perfil.nombre,
        apellido: this.perfil.apellido,
        telefono: this.perfil.telefono,
        email:    this.perfil.email,
      });
      this.cargando.set(false);
    }, 400);
  }

  // ── Guardar perfil ─────────────────────────────────────────────────────────

  guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    this.guardandoPerfil.set(true);

    const dto: ActualizarPerfilDTO = {
      nombre:   this.formPerfil.value.nombre,
      apellido: this.formPerfil.value.apellido,
      telefono: this.formPerfil.value.telefono,
      email:    this.formPerfil.value.email,
    };

    // TODO: reemplazar con tu servicio real, ej:
    // this.usuarioService.actualizarPerfil(dto).subscribe({ ... })

    setTimeout(() => {
      this.perfil = { ...this.perfil, ...dto };
      this.guardandoPerfil.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Perfil actualizado',
        detail: 'Los datos se guardaron correctamente.',
        life: 3000,
      });
    }, 600);
  }

  // ── Cambiar contraseña ─────────────────────────────────────────────────────

  cambiarPassword(): void {
    if (this.formPassword.invalid) {
      this.formPassword.markAllAsTouched();
      return;
    }

    this.guardandoPassword.set(true);

    const dto: CambiarPasswordDTO = {
      passwordActual:    this.formPassword.value.passwordActual,
      passwordNueva:     this.formPassword.value.passwordNueva,
      confirmarPassword: this.formPassword.value.confirmarPassword,
    };

    // TODO: reemplazar con tu servicio real, ej:
    // this.usuarioService.cambiarPassword(dto).subscribe({ ... })

    setTimeout(() => {
      this.guardandoPassword.set(false);
      this.formPassword.reset();
      this.messageService.add({
        severity: 'success',
        summary: 'Contraseña actualizada',
        detail: 'Tu contraseña fue cambiada exitosamente.',
        life: 3000,
      });
    }, 600);
  }

  // ── Validador personalizado ────────────────────────────────────────────────

  private passwordsCoinciden(group: FormGroup) {
    const nueva    = group.get('passwordNueva')?.value;
    const confirmar = group.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  // ── Helpers de UI ──────────────────────────────────────────────────────────

  get inicialesAvatar(): string {
    const n = this.perfil.nombre?.[0] ?? '';
    const a = this.perfil.apellido?.[0] ?? '';
    return (n + a).toUpperCase();
  }

  get labelRol(): string {
    return this.perfil.roles?.[0]?.toUpperCase() ?? 'SIN ROL';
  }

  campoInvalido(form: FormGroup, campo: string): boolean {
    const ctrl = form.get(campo);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  toggleVisible(campo: 'actual' | 'nueva' | 'confirmar'): void {
    if (campo === 'actual')    this.mostrarPasswordActual.update(v => !v);
    if (campo === 'nueva')     this.mostrarPasswordNueva.update(v => !v);
    if (campo === 'confirmar') this.mostrarConfirmar.update(v => !v);
  }

  // ── Indicador de seguridad de contraseña ───────────────────────────────────

  get nivelSeguridad(): number {
    const val: string = this.formPassword.get('passwordNueva')?.value ?? '';
    let nivel = 0;
    if (val.length >= 8)              nivel++;
    if (/[A-Z]/.test(val))            nivel++;
    if (/[0-9]/.test(val))            nivel++;
    if (/[^A-Za-z0-9]/.test(val))     nivel++;
    return nivel;
  }

  get colorSeguridad(): string {
    const colores: Record<number, string> = {
      1: 'bg-red-500',
      2: 'bg-orange-400',
      3: 'bg-yellow-400',
      4: 'bg-green-500',
    };
    return colores[this.nivelSeguridad] ?? 'bg-zinc-700';
  }

  get textoSeguridad(): string {
    const labels: Record<number, string> = {
      1: 'Muy débil',
      2: 'Débil',
      3: 'Moderada',
      4: 'Fuerte',
    };
    return labels[this.nivelSeguridad] ?? '';
  }

  get textoColorSeguridad(): string {
    const colores: Record<number, string> = {
      1: 'text-red-400',
      2: 'text-orange-400',
      3: 'text-yellow-400',
      4: 'text-green-400',
    };
    return colores[this.nivelSeguridad] ?? 'text-zinc-400';
  }

  get permisosDelRol(): string[] {
    const mapaPermisos: Record<string, string[]> = {
      admin: [
        'BARBERO_CREATE', 'BARBERO_VIEW', 'BARBERO_UPDATE', 'BARBERO_DELETE',
        'CLIENTE_CREATE', 'CLIENTE_VIEW', 'CLIENTE_UPDATE', 'CLIENTE_DELETE',
        'PRODUCTO_CREATE', 'PRODUCTO_READ', 'PRODUCTO_UPDATE', 'PRODUCTO_DELETE',
        'CATEGORIA_CREATE', 'CATEGORIA_READ', 'CATEGORIA_UPDATE', 'CATEGORIA_DELETE',
        'SERVICIO_CREATE', 'SERVICIO_READ', 'SERVICIO_UPDATE', 'SERVICIO_DELETE',
        'RESERVA_CREATE', 'RESERVA_READ', 'RESERVA_UPDATE', 'RESERVA_DELETE', 'RESERVA_CONFIRM', 'RESERVA_CANCEL',
        'VENTA_CREATE', 'VENTA_READ', 'VENTA_UPDATE', 'VENTA_DELETE', 'VENTA_ANULAR',
        'CORTE_CREATE', 'CORTE_READ', 'CORTE_UPDATE', 'CORTE_DELETE', 'CORTE_FINALIZAR',
        'USUARIO_CREATE', 'USUARIO_READ', 'USUARIO_UPDATE', 'USUARIO_DELETE',
        'REPORTE_READ', 'ESTADISTICA_READ', 'DASHBOARD_READ',
        'CONFIGURACION_READ', 'CONFIGURACION_UPDATE',
      ],
      barbero: [
        'PRODUCTO_READ', 'CATEGORIA_READ', 'SERVICIO_READ',
        'RESERVA_CREATE', 'RESERVA_READ', 'RESERVA_UPDATE', 'RESERVA_CONFIRM', 'RESERVA_CANCEL',
        'VENTA_CREATE', 'VENTA_READ',
        'CORTE_CREATE', 'CORTE_READ', 'CORTE_UPDATE', 'CORTE_FINALIZAR',
        'DASHBOARD_READ',
      ],
      cliente: [
        'PRODUCTO_READ', 'SERVICIO_READ',
        'RESERVA_CREATE', 'RESERVA_READ', 'RESERVA_CANCEL',
        'VENTA_READ',
      ],
    };

    const rol = this.perfil.roles?.[0]?.toLowerCase() ?? '';
    return mapaPermisos[rol] ?? [];
  }
}
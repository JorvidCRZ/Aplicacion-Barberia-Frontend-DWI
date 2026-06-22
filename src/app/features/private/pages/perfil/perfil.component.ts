import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { PersonaService } from '@/app/core/services/gestion/persona.service';
import { ApiResponse } from '@/app/core/models/common/index.model';
import { AuthService } from '@/app/core/services/auth/auth.service';

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface PerfilClienteDTO {
  idPersona: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaRegistro?: string;
}

export interface ActualizarPerfilClienteDTO {
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
  selector: 'app-perfil',
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
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class PerfilComponent implements OnInit {

  private readonly fb             = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly clienteService = inject(ClienteService);
  private readonly personaService = inject(PersonaService);
private readonly authService = inject(AuthService);
  // ── Estado ─────────────────────────────────────────────────────────────────

  cargando              = signal(false);
  guardandoPerfil       = signal(false);
  guardandoPassword     = signal(false);
  mostrarPasswordActual = signal(false);
  mostrarPasswordNueva  = signal(false);
  mostrarConfirmar      = signal(false);

  perfil: PerfilClienteDTO = {
    idPersona: 0,
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
  };

  formPerfil!: FormGroup;
  formPassword!: FormGroup;

  // ── Ciclo de vida ──────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.initForms();
    this.cargarPerfil();
  }

  // ── Inicialización de formularios ──────────────────────────────────────────

  private initForms(): void {
    this.formPerfil = this.fb.group({
      nombre:   ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email:    [{ value: '', disabled: true }],
      telefono: ['', [Validators.pattern(/^\d{9,15}$/)]],
    });

    this.formPassword = this.fb.group(
      {
        passwordActual:    ['', [Validators.required, Validators.minLength(6)]],
        passwordNueva:     ['', [Validators.required, Validators.minLength(8)]],
        confirmarPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsCoinciden }
    );
  }

  // ── Carga del perfil ───────────────────────────────────────────────────────

  cargarPerfil(): void {
    this.cargando.set(true);

    this.clienteService.obtenerPerfilPropio().subscribe({
      next: (res: ApiResponse<any>) => {
        const data    = res.data;
        const persona = data.persona;

        this.perfil = {
          idPersona:     persona.personaId,
          nombre:        persona.nombre,
          apellido:      persona.apellido,
          telefono:      persona.telefono,
          email:         persona.email,
          fechaRegistro: data.fechaRegistro,
        };

        this.formPerfil.patchValue({
          nombre:   persona.nombre,
          apellido: persona.apellido,
          telefono: persona.telefono,
          email:    persona.email,
        });

        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el perfil.',
          life: 3000,
        });
      },
    });
  }

  // ── Guardar perfil ─────────────────────────────────────────────────────────

  guardarPerfil(): void {
    if (this.formPerfil.invalid) {
      this.formPerfil.markAllAsTouched();
      return;
    }

    this.guardandoPerfil.set(true);

    const dto: ActualizarPerfilClienteDTO = {
      nombre:   this.formPerfil.value.nombre,
      apellido: this.formPerfil.value.apellido,
      telefono: this.formPerfil.value.telefono,
      email:    this.perfil.email, // viene del perfil, el campo está disabled
    };

    this.personaService.actualizarPersona(this.perfil.idPersona, dto).subscribe({
      next: () => {
        this.perfil = { ...this.perfil, ...dto };
        this.guardandoPerfil.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Perfil actualizado',
          detail: 'Los datos se guardaron correctamente.',
          life: 3000,
        });
      },
      error: () => {
        this.guardandoPerfil.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el perfil.',
          life: 3000,
        });
      },
    });
  }

  // ── Cambiar contraseña ─────────────────────────────────────────────────────

  cambiarPassword(): void {
  if (this.formPassword.invalid) {
    this.formPassword.markAllAsTouched();
    return;
  }

  this.guardandoPassword.set(true);

  this.authService.cambiarPassword(
    this.formPassword.value.passwordActual,
    this.formPassword.value.passwordNueva,
  ).subscribe({
    next: () => {
      this.guardandoPassword.set(false);
      this.formPassword.reset();
      this.messageService.add({
        severity: 'success',
        summary: 'Contraseña actualizada',
        detail: 'Tu contraseña fue cambiada exitosamente.',
        life: 3000,
      });
    },
    error: (err) => {
      this.guardandoPassword.set(false);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: err.error?.message ?? 'La contraseña actual es incorrecta.',
        life: 3000,
      });
    },
  });
}

  // ── Validador personalizado ────────────────────────────────────────────────

  private passwordsCoinciden(group: FormGroup) {
    const nueva     = group.get('passwordNueva')?.value;
    const confirmar = group.get('confirmarPassword')?.value;
    return nueva === confirmar ? null : { noCoinciden: true };
  }

  // ── Helpers de UI ──────────────────────────────────────────────────────────

  get inicialesAvatar(): string {
    const n = this.perfil.nombre?.[0] ?? '';
    const a = this.perfil.apellido?.[0] ?? '';
    return (n + a).toUpperCase();
  }

  get miembroDesde(): string {
    if (!this.perfil.fechaRegistro) return '—';
    const fecha = new Date(this.perfil.fechaRegistro);
    return fecha.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    }).toUpperCase();
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

  // ── Indicador de seguridad ─────────────────────────────────────────────────

  get nivelSeguridad(): number {
    const val: string = this.formPassword.get('passwordNueva')?.value ?? '';
    let nivel = 0;
    if (val.length >= 8)          nivel++;
    if (/[A-Z]/.test(val))        nivel++;
    if (/[0-9]/.test(val))        nivel++;
    if (/[^A-Za-z0-9]/.test(val)) nivel++;
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
      1: 'Muy débil', 2: 'Débil', 3: 'Moderada', 4: 'Fuerte',
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
}
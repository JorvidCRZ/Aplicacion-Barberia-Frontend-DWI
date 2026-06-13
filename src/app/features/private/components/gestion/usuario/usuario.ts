import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { HeaderUsuario } from "./components/header-usuario/header-usuario";
import { TableUsers } from './components/table-users/table-users';
import { FiltrarUsers, FiltroUsuario } from './components/filtrar-users/filtrar-users';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { UsuarioTablaResponse } from '@/app/core/models/gestion/usuario.model';
import { AdminRegister } from '@/app/core/models/auth/usuario/admin-register.model';
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';


@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    MessageModule,
    PasswordModule,
    HeaderUsuario,
    FiltrarUsers,
    TableUsers,
  ],
  templateUrl: './usuario.html',
  styleUrl: './usuario.css',
})
export class Usuario implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usuarioService = inject(UsuarioService);
  private readonly notificationService = inject(NotificationService);
  private readonly pageSize = 10;

  usuarios: any[] = [];
  totalElements = 0;
  totalPages = 0;
  currentPage = 0;
  cargando = false;
  errorCarga = '';
  searchTerm = '';
  isSearchMode = false;
  showCrearAdminModal = false;
  adminLoading = false;
  adminError = '';
  adminSubmitted = false;
  private filtrosConsulta: {
    rol?: string;
    tieneQr?: boolean;
    multiplesRoles?: boolean;
  } = {};

  filtrosActuales: FiltroUsuario = {
    rol: '',
    tipo: '',
    qr: '',
    cantidadRoles: '',
  };

  adminForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
    telefono: ['', [Validators.pattern('^\\d{9}$')]],
    email: ['', [Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    passwordConfirm: ['', [Validators.required]],
  });

  constructor() {
    // attach cross-field validator for password match
    this.adminForm.setValidators(this.passwordsMatchValidator);
  }

  ngOnInit(): void {
    this.cargarUsuarios(0);
  }

  cargarUsuarios(page: number = 0): void {
    this.cargando = true;
    this.errorCarga = '';

    const request$ = this.isSearchMode && this.searchTerm.trim().length > 0
      ? this.usuarioService.buscar(this.searchTerm.trim(), page, this.pageSize)
      : this.tieneFiltrosActivos()
      ? this.usuarioService.filtrar(this.filtrosConsulta, page, this.pageSize)
      : this.usuarioService.listar(page, this.pageSize);

    request$.subscribe({
      next: (response) => this.aplicarRespuesta(response, page),
      error: () => {
        this.cargando = false;
        this.errorCarga = 'No se pudo cargar la tabla de usuarios.';
      },
    });
  }

  onPrevPage(): void {
    if (this.currentPage <= 0) return;
    this.cargarUsuarios(this.currentPage - 1);
  }

  onNextPage(): void {
    if (this.currentPage >= this.totalPages - 1) return;
    this.cargarUsuarios(this.currentPage + 1);
  }

  onApplyFilters(filtros: FiltroUsuario): void {
    this.filtrosActuales = filtros;
    this.searchTerm = '';
    this.isSearchMode = false;
    this.filtrosConsulta = this.mapearFiltrosConsulta(filtros);
    this.cargarUsuarios(0);
  }

  onClearFilters(): void {
    this.filtrosActuales = {
      rol: '',
      tipo: '',
      qr: '',
      cantidadRoles: '',
    };
    this.filtrosConsulta = {};
    this.cargarUsuarios(0);
  }

  onSearch(texto: string): void {
    this.searchTerm = (texto || '').trim();

    if (this.searchTerm.length > 0) {
      this.isSearchMode = true;
      this.filtrosActuales = {
        rol: '',
        tipo: '',
        qr: '',
        cantidadRoles: '',
      };
      this.filtrosConsulta = {};
      this.cargarUsuarios(0);
      return;
    }

    this.isSearchMode = false;
    this.cargarUsuarios(0);
  }

  abrirModalAdmin(): void {
    this.showCrearAdminModal = true;
    this.adminError = '';
    this.adminSubmitted = false;
    this.adminForm.reset({
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      username: '',
      password: '',
      passwordConfirm: '',
    });
  }

  cerrarModalAdmin(): void {
    this.showCrearAdminModal = false;
    this.adminError = '';
    this.adminSubmitted = false;
    this.adminLoading = false;
  }

  isAdminInvalid(campo: string): boolean {
    return campoInvalido(this.adminForm, campo, this.adminSubmitted);
  }

  passwordsMismatch(): boolean {
    const p = this.adminForm.get('password')?.value ?? '';
    const c = this.adminForm.get('passwordConfirm')?.value ?? '';
    return !!(p || c) && p !== c;
  }

  private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value ?? '';
    const confirm = group.get('passwordConfirm')?.value ?? '';
    const confirmControl = group.get('passwordConfirm');

    if (password && confirm && password !== confirm) {
      confirmControl?.setErrors({ ...(confirmControl?.errors || {}), passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // remove passwordMismatch if present and now matching
    if (confirmControl?.errors && confirmControl.errors['passwordMismatch']) {
      const errs = { ...confirmControl.errors } as any;
      delete errs['passwordMismatch'];
      const remaining = Object.keys(errs).length ? errs : null;
      confirmControl.setErrors(remaining);
    }

    return null;
  }

  onPhoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let val = (input.value || '').toString();
    // remove non-digits and limit to 9 chars
    val = val.replace(/\D/g, '').slice(0, 9);
    // limit to 9 digits (no requirement about starting digit)
    input.value = val;
    this.adminForm.get('telefono')?.setValue(val, { emitEvent: true });
  }

  onSubmitAdmin(): void {
    this.adminSubmitted = true;
    this.adminError = '';
    marcarFormulario(this.adminForm);

    const passwordConfirmControl = this.adminForm.get('passwordConfirm');
    if (passwordConfirmControl?.hasError('passwordMismatch')) {
      passwordConfirmControl.setErrors(null);
    }

    if (this.adminForm.invalid) {
      this.notificationService.showError('Por favor corrige los campos marcados antes de continuar.', 'Error de validación');
      return;
    }

    const password = this.adminForm.value.password ?? '';
    const passwordConfirm = this.adminForm.value.passwordConfirm ?? '';

    if (password !== passwordConfirm) {
      passwordConfirmControl?.setErrors({ passwordMismatch: true });
      this.adminError = 'Las contraseñas no coinciden.';
      this.notificationService.showError('Las contraseñas no coinciden.', 'Error de validación');
      return;
    }

    const payload: AdminRegister = {
      nombre: (this.adminForm.value.nombre ?? '').trim(),
      apellido: (this.adminForm.value.apellido ?? '').trim(),
      telefono: (this.adminForm.value.telefono ?? '').trim() || undefined,
      email: (this.adminForm.value.email ?? '').trim() || undefined,
      username: (this.adminForm.value.username ?? '').trim(),
      password,
      idRol: 1,
    };

    this.adminLoading = true;

    this.usuarioService.registrarAdmin(payload).subscribe({
      next: () => {
        this.adminLoading = false;
        this.showCrearAdminModal = false;
        this.notificationService.showSuccess('Administrador registrado correctamente.');
        this.cargarUsuarios(this.currentPage);
      },
      error: (err) => {
        this.adminLoading = false;
        this.adminError = err?.error?.message ?? 'No se pudo registrar el administrador.';
        this.notificationService.showHttpError(err, 'No se pudo registrar el administrador');
      },
    });
  }

  private aplicarRespuesta(response: any, page: number): void {
    const pageData: any = response?.data ?? {};
    const content: UsuarioTablaResponse[] = pageData.content ?? [];

    this.usuarios = content.map((usuario) => this.mapearUsuarioTabla(usuario));
    this.totalElements = pageData.totalElements ?? this.usuarios.length;
    this.totalPages = pageData.totalPages ?? 0;
    this.currentPage = pageData.number ?? pageData.pageNumber ?? page;
    this.cargando = false;
  }

  private mapearUsuarioTabla(usuario: UsuarioTablaResponse): any {
    return {
      usuarioId: usuario.idUsuario,
      username: usuario.usuario,
      persona: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
      },
      roles: usuario.roles ?? [],
      tieneQr: usuario.tieneQr, 
      tienePin: usuario.tienePin ?? false,
      activo: null,
      ultimoAcceso: '—',
    };
  }

  private mapearFiltrosConsulta(filtros: FiltroUsuario): {
    rol?: string;
    tieneQr?: boolean;
    multiplesRoles?: boolean;
  } {
    return {
      rol: filtros.rol?.trim() || undefined,
      tieneQr: filtros.qr === 'conQr' ? true : filtros.qr === 'sinQr' ? false : undefined,
      multiplesRoles: filtros.cantidadRoles === 'multiplesRoles'
        ? true
        : filtros.cantidadRoles === 'unRol'
          ? false
          : undefined,
    };
  }

  private tieneFiltrosActivos(): boolean {
    return Boolean(
      this.filtrosConsulta.rol ||
      this.filtrosConsulta.tieneQr !== undefined ||
      this.filtrosConsulta.multiplesRoles !== undefined
    );
  }
}

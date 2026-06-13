import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { BarberoRegister } from '@/app/core/models/auth/usuario/barbero-register.model';
import { DatePickerModule } from 'primeng/datepicker';
@Component({
  selector: 'app-registrar-barbero',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,DatePickerModule],
  templateUrl: './registrar-barbero.html',
  styleUrl: './registrar-barbero.css',
})
export class RegistrarBarbero {
  form: FormGroup;
  showConfirm = false;
  isSubmitting = false;
  showPassword = false;
  showPasswordConfirm = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private notification: NotificationService,
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],

      usuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],

      experiencia: [0],
      fechaIngreso: [new Date().toISOString().slice(0,10)],
      sueldo: [''],
      comision: ['']
    }, { validators: this.passwordsMatchValidator });
  }

  get f() { return this.form.controls; }

  togglePassword() { this.showPassword = !this.showPassword; }
  togglePasswordConfirm() { this.showPasswordConfirm = !this.showPasswordConfirm; }

  passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const p = group.get('password')?.value;
    const pc = group.get('passwordConfirm')?.value;
    if (p && pc && p !== pc) {
      return { passwordMismatch: true };
    }
    return null;
  }

  passwordMismatch(): boolean {
    return !!(this.form.errors && (this.form.errors as any).passwordMismatch && (this.f['passwordConfirm'].touched || this.f['passwordConfirm'].dirty));
  }

  onPhoneInput(event: any): void {
    const raw: string = (event.target.value || '').toString();
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    this.form.get('telefono')?.setValue(digits, { emitEvent: false });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.openConfirm();
  }

  openConfirm(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    const pwd = this.form.get('password')?.value;
    const pwdConfirm = this.form.get('passwordConfirm')?.value;
    if (pwd !== pwdConfirm) {
      this.form.get('passwordConfirm')?.setErrors({ mismatch: true });
      return;
    }
    this.showConfirm = true;
  }

  closeConfirm(): void { this.showConfirm = false; this.isSubmitting = false; }

  submitConfirmed(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const v = this.form.value;
    const payload: BarberoRegister = {
      idRol: 2,
      nombre: v.nombre ?? '',
      apellido: v.apellido ?? '',
      telefono: v.telefono ?? '',
      email: v.email ?? '',
      username: v.usuario ?? '',
      password: v.password ?? '',
      experiencia: Number(v.experiencia) || 0,
      sueldo: v.sueldo ? Number(v.sueldo) : 0,
      comision: v.comision ? Number(v.comision) : 0,
      descripcion: '',
      fotoUrl: null,
    };

    this.usuarioService.registrarBarbero(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showSuccess(res?.message || 'Barbero creado correctamente');
        this.router.navigate(['/dashboard/admin/gestion/barberos']);
      },
      error: (err) => {
        console.error('Error crear barbero', err);
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showHttpError(err, 'Crear barbero');
      }
    });
  }
}

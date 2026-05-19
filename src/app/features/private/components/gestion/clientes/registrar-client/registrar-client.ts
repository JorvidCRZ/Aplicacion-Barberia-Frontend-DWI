import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '@/app/core/services/auth/usuario.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  selector: 'app-registrar-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registrar-client.html',
  styleUrl: './registrar-client.css',
})
export class RegistrarClient {
  form: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService, private notification: NotificationService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      telefono: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required]
    });
  }

  get f() {
    return this.form.controls;
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  submit(): void {
    // kept for form submit fallback
    if (this.form.invalid) return;
    this.openConfirm();
  }

  showConfirm: boolean = false;
  isSubmitting: boolean = false;
  showPassword: boolean = false;
  showPasswordConfirm: boolean = false;

  openConfirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // validate password confirmation
    const pwd = this.form.get('password')?.value;
    const pwdConfirm = this.form.get('passwordConfirm')?.value;
    if (pwd !== pwdConfirm) {
      this.form.get('passwordConfirm')?.setErrors({ mismatch: true });
      return;
    } else {
      // clear previous mismatch error if any
      const ctrl = this.form.get('passwordConfirm');
      if (ctrl?.errors) {
        const { mismatch, ...rest } = ctrl.errors;
        const hasOther = Object.keys(rest).length > 0;
        ctrl.setErrors(hasOther ? rest : null);
      }
    }
    this.showConfirm = true;
  }

  closeConfirm(): void {
    this.showConfirm = false;
    this.isSubmitting = false;
  }

  submitConfirmed(): void {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    const value = this.form.value;
    const payload: any = {
      nombre: value.nombre,
      apellido: value.apellido,
      telefono: value.telefono,
      email: value.email,
      username: value.usuario,
      password: value.password,
      idRol: 3
    };
    console.log('Enviar payload registrarCliente:', payload);
    this.usuarioService.registrarCliente(payload).subscribe({
      next: (res) => {
        console.log('registrarCliente response:', res);
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showSuccess(res?.message || 'Cliente creado correctamente');
        this.router.navigate(['/dashboard/gestion/clientes']);
      },
      error: (err) => {
        console.error('Error al registrar cliente', err);
        this.isSubmitting = false;
        this.showConfirm = false;
        this.notification.showHttpError(err, 'Crear cliente');
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  togglePasswordConfirm(): void {
    this.showPasswordConfirm = !this.showPasswordConfirm;
  }
}

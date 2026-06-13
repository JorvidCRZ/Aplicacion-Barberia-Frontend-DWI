import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private usuarioService: UsuarioService, private notification: NotificationService) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern('^\\d{9}$')]],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required]
    });

    // cross-field validator for password match
    this.form.setValidators(this.passwordsMatchValidator);
  }

  get f() {
    return this.form.controls;
  }

  isFieldInvalid(name: string): boolean {
    const ctrl = this.form.get(name);
    return !!(ctrl && ctrl.invalid && (ctrl.touched || ctrl.dirty));
  }

  passwordsMismatch(): boolean {
    const p = this.form.get('password')?.value ?? '';
    const c = this.form.get('passwordConfirm')?.value ?? '';
    return !!(p || c) && p !== c;
  }

  private passwordsMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value ?? '';
    const confirm = group.get('passwordConfirm')?.value ?? '';
    const confirmControl = group.get('passwordConfirm');

    if (password && confirm && password !== confirm) {
      confirmControl?.setErrors({ ...(confirmControl?.errors || {}), mismatch: true });
      return { mismatch: true };
    }

    // remove mismatch if present and now matching
    if (confirmControl?.errors && confirmControl.errors['mismatch']) {
      const errs = { ...confirmControl.errors } as any;
      delete errs['mismatch'];
      const remaining = Object.keys(errs).length ? errs : null;
      confirmControl.setErrors(remaining);
    }

    return null;
  }

  onPhoneInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let val = (input.value || '').toString();
    val = val.replace(/\D/g, '').slice(0, 9);
    input.value = val;
    this.form.get('telefono')?.setValue(val, { emitEvent: true });
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
      this.notification.showError('Por favor corrige los campos marcados antes de continuar.', 'Error de validación');
      return;
    }

    // passwords mismatch handled by validator, show notification if mismatch
    if (this.passwordsMismatch()) {
      this.notification.showError('Las contraseñas no coinciden.', 'Error de validación');
      return;
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
        this.router.navigate(['../'], { relativeTo: this.route });
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

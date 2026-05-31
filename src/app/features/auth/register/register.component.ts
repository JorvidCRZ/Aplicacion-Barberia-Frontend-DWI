import { LogoComponent } from '@/app/shared/components/logo/logo.component';
import { Router, RouterLink } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from 'primeng/password';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { campoInvalido, marcarFormulario } from '@/app/shared/utils/form-utils.component';
import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';


@Component({
  standalone: true,
  selector: 'app-register',
  imports: [LogoComponent, InputTextModule, MessageModule, CheckboxModule,
    PasswordModule, ReactiveFormsModule, RouterLink, ButtonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMsg = '';
  loading = false;
  submitted = false;

  registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    telefono: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(4)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required]],
    terminos: [false, [Validators.requiredTrue]]
  });

  isInvalid(campo: string): boolean {
    return campoInvalido(this.registerForm, campo, this.submitted);
  }

  onSubmit() {
    this.submitted = true;
    marcarFormulario(this.registerForm);
    if (this.registerForm.invalid) return;
    const { email, password, nombre, apellido, telefono, username } = this.registerForm.value;
const payload = {
  username: username!,
  password: password!,
  idRol: 3,            // ← cliente siempre es rol 3
  nombre: nombre!,
  apellido: apellido!,
  telefono: telefono!,
  email: email!        // ← corregido
};

    this.loading = true;
    this.errorMsg = '';

    console.log('payload enviado:', payload);

    this.authService.register(payload).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        this.errorMsg = err.error?.message ?? 'Error al registrarse';
        this.loading = false;
      }
    });
  }
}


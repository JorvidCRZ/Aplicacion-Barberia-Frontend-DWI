import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-inicio',
  imports: [ButtonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {
  private router = inject(Router);
  
  reservarCita() {
    this.router.navigate(['/reservas']);
  }

  verServicios() {
    this.router.navigate(['/servicios']);
  }
}

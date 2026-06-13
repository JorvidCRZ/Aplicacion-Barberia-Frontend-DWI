import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '@/environments/environment.development';
import { Router } from '@angular/router';

import { ServicioService } from '../../../../core/services/catalogos/servicio.service';
import { Servicio } from '../../../../core/models/catalogos/servicios.model';
import { TokenService } from '../../../../core/services/auth/token.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class ServiciosComponent implements OnInit {

  private servicioService = inject(ServicioService);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  servicios: Servicio[] = [];
  cargando = true;

  servicioSeleccionado: Servicio | null = null;
  mostrarModal = false;
  cargandoDetalle = false;

  ngOnInit(): void {
    this.obtenerServicios();
  }

  irAReservas(): void {
    this.router.navigate(['/reservas']);
  }

  obtenerServicios(): void {
    this.cargando = true;
    this.servicioService.obtenerServicioPublicos({ page: 0, size: 100 }).subscribe({
      next: (response) => {
        this.servicios = response.data.content;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener servicios:', error);
        this.cargando = false;
      }
    });
  }

  abrirDetalle(id: number): void {
    this.mostrarModal = true;
    this.cargandoDetalle = true;
    this.servicioService.obtenerServicioPublicosId(id).subscribe({
      next: (response) => {
        this.servicioSeleccionado = response.data;
        this.cargandoDetalle = false;
      },
      error: (error) => {
        console.error('Error al obtener el detalle del servicio:', error);
        this.cargandoDetalle = false;
      }
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    setTimeout(() => this.servicioSeleccionado = null, 300);
  }

  irAReservar(): void {
    if (this.servicioSeleccionado) {
      const idServicio = this.servicioSeleccionado.servicioId;
      this.cerrarModal();

      if (this.tokenService.isLogged()) {

        if (this.tokenService.getPrimaryRole() === 'cliente') {
          this.router.navigate(['/mi-cuenta/reservar/agendar'], {
            queryParams: { servicioId: idServicio }
          });
        }

        else {
          this.router.navigate([`/dashboard/${this.tokenService.getPrimaryRole()}/operaciones/reservas/nueva`]);
        }

      } else {
        const rutaDestino = `/mi-cuenta/reservar/agendar?servicioId=${idServicio}`;

        this.router.navigate(['/login'], {
          queryParams: { returnUrl: rutaDestino }
        });
      }
    }
  }

  obtenerImagen(servicio: Servicio): string {
    if (servicio.urlsMultimedia && servicio.urlsMultimedia.length > 0 && servicio.urlsMultimedia[0]) {
      const url = servicio.urlsMultimedia[0];
      if (url.startsWith('http')) return url;
      const baseUrl = environment.apiUrl.replace('/api/v1', '');
      let imagePath = url.startsWith('/') ? url : `/${url}`;
      if (!imagePath.startsWith('/uploads/')) { imagePath = `/uploads${imagePath}`; }
      return `${baseUrl}${imagePath}`;
    }
    return '/assets/cortebarba.jpg';
  }
}
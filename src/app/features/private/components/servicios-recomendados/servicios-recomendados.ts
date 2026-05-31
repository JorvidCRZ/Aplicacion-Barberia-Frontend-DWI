import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioResponseDTO } from '@/app/core/models/gestion/cliente/ClienteResumen.model';

@Component({
  selector: 'app-servicios-recomendados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios-recomendados.html',
  styleUrl: './servicios-recomendados.css',
})
export class ServiciosRecomendados {
  @Input() servicios: ServicioResponseDTO[] = [];
  @Output() reservar = new EventEmitter<ServicioResponseDTO>();

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = 'assets/images/service-placeholder.jpg';
  }
}
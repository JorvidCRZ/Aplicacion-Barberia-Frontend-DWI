import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { ServicioCardComponent } from '../servicio-card/servicio-card.component';

@Component({
  standalone: true,
  selector: 'app-servicio-lista',
  imports: [CommonModule, ServicioCardComponent],
  templateUrl: './servicio-lista.html',
})
export class ServicioListaComponent {
  @Input() servicios: Servicio[] = [];
  @Input() cargando = false;
  @Output() seleccionado = new EventEmitter<number>();

  trackById(_i: number, s: Servicio) {
    return s.servicioId;
  }
}
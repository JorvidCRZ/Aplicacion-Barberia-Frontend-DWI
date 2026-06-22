import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';

@Component({
  standalone: true,
  selector: 'app-servicio-detalle',
  imports: [CommonModule, SafeImageUrlPipe, StatusBadgeComponent],
  templateUrl: './servicio-detalle.html',
})
export class ServicioDetalleComponent {
  @Input() servicio: Servicio | null = null;
  @Input() cargando = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() reservar = new EventEmitter<void>();
}
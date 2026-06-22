import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';

@Component({
  standalone: true,
  selector: 'app-servicio-card',
  imports: [SolesPipe, SafeImageUrlPipe,StatusBadgeComponent],
  templateUrl: './servicio-card.html',
})
export class ServicioCardComponent {
  @Input() servicio!: Servicio;
  @Output() seleccionado = new EventEmitter<number>();

  onSeleccionar(): void {
    this.seleccionado.emit(this.servicio.servicioId);
  }
}
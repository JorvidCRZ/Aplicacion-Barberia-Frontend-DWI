import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorteRecomendado } from '@core/models/reconocimiento-facial/Ia.model';

@Component({
  selector: 'app-corte-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './corte-modal.html',
  styleUrl: './corte-modal.css'
})
export class CorteModal {

  @Input()
  corte?: CorteRecomendado;

  @Output()
  cerrar = new EventEmitter<void>();

  cerrarModal() {
    this.cerrar.emit();
  }

  

}
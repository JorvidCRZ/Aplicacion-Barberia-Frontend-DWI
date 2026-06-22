import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IaService } from '@core/services/reconocimiento-facial/reconocimiento-facial.service';
import { CorteRecomendado } from '@core/models/reconocimiento-facial/Ia.model';

@Component({
  selector: 'app-corte-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './corte-card.html',
  styleUrl: './corte-card.css'
})
export class CorteCard {

  @Input()
  corte!: CorteRecomendado;

  @Input()
  clienteId = 1;

  @Output()
  ver = new EventEmitter<CorteRecomendado>();

  rating = 0;

  liked?: boolean;

  constructor(
    private iaService: IaService
  ) {}

  abrirModal() {
  console.log('emitiendo corte', this.corte);
  this.ver.emit(this.corte);
}

  like() {

    this.liked = true;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        true,
        5
      )
      .subscribe();

  }

  dislike() {

    this.liked = false;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        false,
        1
      )
      .subscribe();

  }

  calificar(valor: number) {

    this.rating = valor;

    this.iaService
      .enviarFeedback(
        this.clienteId,
        this.corte.id,
        valor >= 3,
        valor
      )
      .subscribe();

  }

}
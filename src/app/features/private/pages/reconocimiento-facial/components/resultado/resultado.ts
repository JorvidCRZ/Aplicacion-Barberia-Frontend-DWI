import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild
} from '@angular/core';

import { CorteModal } from '../corte-modal/corte-modal';

import { CommonModule, KeyValuePipe } from '@angular/common';

import { AnalisisResponse } from '@core/models/reconocimiento-facial/Ia.model';
import { CorteCard } from '../corte-card/corte-card';

@Component({
  selector: 'app-resultado',
  standalone: true,
  imports: [
    CommonModule,
    KeyValuePipe,
    CorteCard, CorteModal
  ],
  templateUrl: './resultado.html',
  styleUrl: './resultado.css'
})
export class Resultado implements AfterViewInit {

  @Input()
  fotoPreview = '';

  @Input() clienteId: number = 0;



  @ViewChild('overlayCanvas')
  overlayCanvas!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true })
  resultado!: AnalisisResponse;

  @ViewChild('graficoCanvas')
  graficoCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {

    setTimeout(() => {
      this.dibujarGraficoRostro();
    });

  }

  private dibujarGraficoRostro(): void {

    if (!this.resultado?.puntos_grafico) return;

    const canvas = this.graficoCanvas.nativeElement;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const width = 700;
    const height = 500;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    const puntos = this.resultado.puntos_grafico;
    const contorno = this.resultado.contorno_grafico ?? [];

    const padding = 30;

    const transformar = (p: { x: number; y: number }) => ({
      x: padding + p.x * (width - padding * 2),
      y: padding + p.y * (height - padding * 2)
    });

    const vertices = contorno
      .map(nombre => puntos[nombre])
      .filter(Boolean)
      .map(transformar);

    if (vertices.length > 1) {

      ctx.beginPath();

      ctx.moveTo(
        vertices[0].x,
        vertices[0].y
      );

      for (let i = 1; i < vertices.length; i++) {

        ctx.lineTo(
          vertices[i].x,
          vertices[i].y
        );

      }

      ctx.strokeStyle = '#c8a255';
      ctx.lineWidth = 3;
      ctx.stroke();

    }

    Object.entries(puntos).forEach(([nombre, punto]) => {

      const p = transformar(punto);

      ctx.beginPath();

      ctx.arc(
        p.x,
        p.y,
        6,
        0,
        Math.PI * 2
      );

      ctx.fillStyle = '#c8a255';
      ctx.fill();

      ctx.font = '12px Arial';

      ctx.fillStyle = '#ffffff';

      ctx.fillText(
        nombre,
        p.x + 10,
        p.y - 10
      );

    });

  }

  corteSeleccionado: any = null;

  abrirModal(corte: any) {
    this.corteSeleccionado = corte;
  }

  cerrarModal() {
    this.corteSeleccionado = null;
  }

}
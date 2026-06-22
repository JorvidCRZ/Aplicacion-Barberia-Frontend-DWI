import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlanillaBarbero } from '@/app/core/models/planilla/planilla.model';
import { PlanillaService } from '@core/services/planilla/planilla.service';

@Component({
  selector: 'app-grafico-sueldos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grafico-sueldos.html',
  styleUrl: './grafico-sueldos.css',
})
export class GraficoSueldos implements OnInit {

  private readonly planillaService = inject(PlanillaService);

  tipoGrafico: 'completo' | 'comision' = 'comision';
  mes = new Date().getMonth() + 1;
  anio = new Date().getFullYear();
  barberos: PlanillaBarbero[] = [];
  aniosDisponibles: number[] = [];

  readonly meses = [
    { id: 1,  nombre: 'Enero' },
    { id: 2,  nombre: 'Febrero' },
    { id: 3,  nombre: 'Marzo' },
    { id: 4,  nombre: 'Abril' },
    { id: 5,  nombre: 'Mayo' },
    { id: 6,  nombre: 'Junio' },
    { id: 7,  nombre: 'Julio' },
    { id: 8,  nombre: 'Agosto' },
    { id: 9,  nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ];

  ngOnInit(): void {
    this.cargarAnios();
    this.cargarDatos();
  }

  cargarAnios(): void {
    this.planillaService.obtenerAnios().subscribe({
      next: (r) => { this.aniosDisponibles = r.data; },
      error: (err) => console.error('Error al cargar años', err)
    });
  }

  cargarDatos(): void {
    this.planillaService
      .getDetalle(this.mes, this.anio, 0, 20)
      .subscribe({
        next: (r) => { this.barberos = r.data.content; },
        error: (err) => console.error('Error al cargar gráfico', err)
      });
  }

  aplicarFiltro(): void {
    this.cargarDatos();
  }

  get barberosGrafico(): PlanillaBarbero[] {
    return [...this.barberos]
      .filter(b => b.cantidadVentas > 0)
      .sort((a, b) =>
        this.tipoGrafico === 'comision'
          ? b.montoComision - a.montoComision
          : b.sueldoFinal - a.sueldoFinal
      )
      .slice(0, 10);
  }

  get maxValor(): number {
    if (!this.barberosGrafico.length) return 100;
    const max = Math.max(
      ...this.barberosGrafico.map(b =>
        this.tipoGrafico === 'comision'
          ? b.montoComision
          : b.sueldoFinal
      )
    );
    return Math.ceil(max / 100) * 100;
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ResumenPeriodoComponent } from './components/resumen-periodo/resumen-periodo';
import { GraficoSueldos } from './components/grafico-sueldos/grafico-sueldos';
import { TablaSueldos } from './components/tabla-sueldos/tabla-sueldos';

import { PlanillaService } from '@core/services/planilla/planilla.service';

import {
  PlanillaResumen,
  PlanillaBarbero
} from '@core/models/planilla/planilla.model';

@Component({
  selector: 'app-sueldos',
  standalone: true,
  imports: [
    FormsModule,
    ResumenPeriodoComponent,
    GraficoSueldos,
    TablaSueldos
  ],
  templateUrl: './sueldos.html',
  styleUrl: './sueldos.css'
})
export class Sueldos implements OnInit {

  private readonly planillaService = inject(PlanillaService);

  mes = new Date().getMonth() + 1;
  anio = new Date().getFullYear();

  resumen: PlanillaResumen = {
    totalPlanilla: 0,
    totalComisiones: 0,
    sueldoFinalTotal: 0,
    ventasPeriodo: 0,
    barberosActivos: 0
  };

  ngOnInit(): void {
    this.cargarResumen();
  }

  cargarResumen(): void {
    this.planillaService
      .getResumen(this.mes, this.anio)
      .subscribe({
        next: (response) => { this.resumen = response.data; },
        error: (err) => console.error('Error resumen', err)
      });
  }
}
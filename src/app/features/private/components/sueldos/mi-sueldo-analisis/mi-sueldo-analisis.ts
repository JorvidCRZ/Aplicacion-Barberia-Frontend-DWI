import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { PlanillaService } from '@core/services/planilla/planilla.service';
import { ResumenBarbero, VentaBarbero } from '@core/models/planilla/venta-barbero.model';
import { BarberoHeader } from './components/barbero-header/barbero-header';
import { BarberoKpis } from './components/barbero-kpis/barbero-kpis';
import { BarberoVentasTabla } from './components/barbero-ventas-tabla/barbero-ventas-tabla';

@Component({
  selector: 'app-mi-sueldo-analisis',
  imports: [CommonModule, BarberoHeader, BarberoKpis, BarberoVentasTabla],
  templateUrl: './mi-sueldo-analisis.html',
  styleUrl: './mi-sueldo-analisis.css',
})
export class MiSueldoAnalisis implements OnInit {

  private readonly route    = inject(ActivatedRoute);
  private readonly service  = inject(PlanillaService);

  barberoId!: number;

  resumen!: ResumenBarbero;
  ventas: VentaBarbero[] = [];

  page          = 0;
  size          = 20;
  totalElements = 0;
  totalPages    = 0;

  mesActual  = new Date().getMonth() + 1;
  anioActual = new Date().getFullYear();

  cargando        = false;
  cargandoVentas  = false;

  ngOnInit(): void {
    this.barberoId = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarResumen();
    this.cargarVentas(0);
  }

  cargarResumen(): void {
    this.cargando = true;
    this.service.getResumenBarbero(this.barberoId, this.mesActual, this.anioActual)
      .subscribe({
        next: res => {
          this.resumen  = res.data;
          this.cargando = false;
        },
        error: () => { this.cargando = false; }
      });
  }

  cargarVentas(page = 0): void {
    this.cargandoVentas = true;
    this.service.getVentasBarbero(this.barberoId, this.mesActual, this.anioActual, page, this.size)
      .subscribe({
        next: res => {
          this.ventas        = res.data.content;
          this.page          = res.data.number;
          this.totalElements = res.data.totalElements;
          this.totalPages    = res.data.totalPages;
          this.cargandoVentas = false;
        },
        error: () => { this.cargandoVentas = false; }
      });
  }

  cambiarPagina(nuevaPagina: number): void {
  this.cargarVentas(nuevaPagina);
}

aplicarFiltro(filtro: { mes: number; anio: number }): void {
  console.log('filtro recibido:', filtro);
  this.mesActual  = filtro.mes;
  this.anioActual = filtro.anio;
  this.cargarTodo();
}





}
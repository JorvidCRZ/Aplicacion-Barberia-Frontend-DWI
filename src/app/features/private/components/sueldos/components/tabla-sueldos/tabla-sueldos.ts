import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PlanillaService } from '@core/services/planilla/planilla.service';
import { PlanillaBarbero } from '@/app/core/models/planilla/planilla.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabla-sueldos',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],  
  templateUrl: './tabla-sueldos.html',
  styleUrl: './tabla-sueldos.css',
})
export class TablaSueldos implements OnInit {

  private readonly planillaService = inject(PlanillaService);
 private readonly router = inject(Router);

  barberos: PlanillaBarbero[] = [];
  page = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;
  mes = new Date().getMonth() + 1;
  anio = new Date().getFullYear();
  aniosDisponibles: number[] = [];  

  readonly Math = Math;

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
      .getDetalle(this.mes, this.anio, this.page, this.size)
      .subscribe({
        next: (response) => {
          this.barberos = response.data.content;
          this.totalElements = response.data.totalElements;
          this.totalPages = response.data.totalPages;
        },
        error: (err) => console.error(err)
      });
  }

  aplicarFiltro(): void {
    this.page = 0;  
    this.cargarDatos();
  }

  cambiarPagina(nuevaPagina: number): void {
    this.page = nuevaPagina;
    this.cargarDatos();
  }

 verDetalle(barbero: PlanillaBarbero): void {
  this.router.navigate(['/dashboard/admin/sueldos', barbero.barberoId]);
}
}
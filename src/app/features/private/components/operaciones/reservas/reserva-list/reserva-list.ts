import { ApiResponse, Page } from '@/app/core/models/common/index.model';
import { Reserva } from '@/app/core/models/operaciones/Reserva.model';
import { ReservaService } from '@/app/core/services/operaciones/reserva-service';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [
    FloatLabelModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule, 
    FormsModule,
    ButtonModule, 
    CommonModule, 
    TableModule, 
    ToggleSwitchModule,
    StatusBadgeComponent
  ],
  templateUrl: './reserva-list.html',
  styleUrls: ['./reserva-list.css'],
})
export class ReservaList {
  private router = inject(Router);
  private reservaService = inject(ReservaService);

  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 10;
  @Input() first = 0;

  clienteBusqueda: string = '';
  
  reservas: Reserva[] = [];
  loading: boolean = false;
  totalElements: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Estados para filtros
  filtroEstado: string = '';
  filtroFechaInicio: string = '';
  filtroFechaFin: string = '';

  ngOnInit(): void {
    this.loadReservas();
  }

  loadReservas(event?: TableLazyLoadEvent): void {
    this.loading = true;
    
    
    const page = event ? Math.floor(event.first! / (event.rows || this.pageSize)) : this.currentPage;
    const size = event?.rows || this.pageSize;
    
    this.currentPage = page;
    this.pageSize = size;

    
    this.reservaService.getReservas(page, size)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cargado = true;
        })
      )
      .subscribe({
        next: (response: ApiResponse<Page<Reserva>>) => {
          if (response.success && response.data) {
            this.reservas = response.data.content;
            this.totalElements = response.data.totalElements;
            this.totalPages = response.data.totalPages;
            this.totalRecords = response.data.totalElements;
          } else {
            this.reservas = [];
            this.totalElements = 0;
            this.totalRecords = 0;
          }
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
          this.reservas = [];
          this.totalElements = 0;
          this.totalRecords = 0;
        }
      });
  }

  
  

  
  

 
  limpiarFiltros(): void {
    this.clienteBusqueda = '';
    this.filtroEstado = '';
    this.filtroFechaInicio = '';
    this.filtroFechaFin = '';
    this.loadReservas();
  }

  obtenerFechaHora(reserva: Reserva): Date {
    return new Date(`${reserva.fecha}T${reserva.horaInicio}`);
  }

  irNuevaReserva(): void {
    this.router.navigate(['/dashboard/admin/operaciones/reservas/nueva']);
  }

  verDetalle(id: number): void {
    this.router.navigate([`/dashboard/admin/operaciones/reservas/${id}`]);
  }

  editarReserva(id: number): void {
    this.router.navigate([`/dashboard/admin/operaciones/reservas/editar/${id}`]);
  }

  

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMADA':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.loadReservas(event);
  }
}
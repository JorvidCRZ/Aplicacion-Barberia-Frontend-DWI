// mis-reservas.component.ts
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

import { ReservaService } from '@/app/core/services/operaciones/reserva-service';
import { ApiResponse, Page } from '@/app/core/models/common/index.model';
import { Reserva } from '@/app/core/models/operaciones/Reserva.model';

@Component({
  selector: 'app-mis-reservas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './mis-reservas.html',
  styleUrls: ['./mis-reservas.css']
})
export class MisReservasComponent implements OnInit {
  
  private reservaService = inject(ReservaService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private router = inject(Router);

  @ViewChild('dt') table: Table | undefined;

  reservas: Reserva[] = [];
  loading: boolean = false;
  totalRecords: number = 0;
  rows: number = 10;
  first: number = 0;
  currentPage: number = 0;

  // Filtros (para aplicar en el backend)
  estadoFiltro: string = '';
  fechaInicio: string = '';
  fechaFin: string = '';

  estados = [
    { label: 'Todos', value: '' },
    { label: 'Pendiente', value: 'PENDIENTE' },
    { label: 'Confirmada', value: 'CONFIRMADA' },
    { label: 'En Proceso', value: 'EN_PROCESO' },
    { label: 'Finalizada', value: 'FINALIZADA' },
    { label: 'Cancelada', value: 'CANCELADA' }
  ];

  ngOnInit(): void {
    this.cargarMisReservas();
  }

  cargarMisReservas(event?: TableLazyLoadEvent): void {
    this.loading = true;
    
    // Obtener página y tamaño del evento de PrimeNG
    const page = event ? Math.floor((event.first || 0) / (event.rows || this.rows)) : this.currentPage;
    const size = event?.rows || this.rows;
    
    this.currentPage = page;
    this.rows = size;
    
    console.log(`Cargando reservas - Página: ${page}, Tamaño: ${size}`);

    this.reservaService.getMisReservas(page, size)
      .pipe(finalize(() => {
        this.loading = false;
        console.log('Loading completado');
      }))
      .subscribe({
        next: (response: ApiResponse<Page<Reserva>>) => {
          console.log('Respuesta del API:', response);
          
          if (response.success && response.data) {
            // Mapear los campos correctamente
            this.reservas = response.data.content.map(item => ({
              ...item,
              id: item.id, // Asegurar que id esté disponible
              estado: item.estadoReserva // Normalizar el nombre del campo
            }));
            
            this.totalRecords = response.data.totalElements;
            this.rows = response.data.pageSize || size;
            
            console.log(`Reservas cargadas: ${this.reservas.length} de ${this.totalRecords}`);
            console.log('Primera reserva:', this.reservas[0]);
          } else {
            console.warn('La respuesta no tiene datos:', response);
            this.reservas = [];
            this.totalRecords = 0;
          }
        },
        error: (error) => {
          console.error('Error al cargar reservas:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar tus reservas'
          });
          this.reservas = [];
          this.totalRecords = 0;
          this.loading = false;
        }
      });
  }

  aplicarFiltros(): void {
    // Resetear a primera página y recargar con filtros
    this.currentPage = 0;
    this.cargarMisReservas();
  }

  limpiarFiltros(): void {
    this.estadoFiltro = '';
    this.fechaInicio = '';
    this.fechaFin = '';
    this.currentPage = 0;
    this.cargarMisReservas();
  }

  cancelarReserva(reserva: Reserva): void {
    const id = reserva.id || reserva.id;
    
    this.confirmationService.confirm({
      message: `¿Cancelar la reserva del servicio "${reserva.servicio}"?`,
      header: 'Confirmar cancelación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, cancelar',
      rejectLabel: 'No',
      accept: () => {
        this.loading = true;
        this.reservaService.cancelarReserva(id!)
          .pipe(finalize(() => this.loading = false))
          .subscribe({
            next: (response) => {
              if (response.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Reserva cancelada',
                  detail: 'Tu reserva ha sido cancelada exitosamente'
                });
                this.cargarMisReservas(); // Recargar la página actual
              }
            },
            error: (error) => {
              console.error('Error al cancelar:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se pudo cancelar la reserva'
              });
            }
          });
      }
    });
  }

  obtenerFechaHora(reserva: Reserva): Date {
    return new Date(`${reserva.fecha}T${reserva.horaInicio}`);
  }

  puedeCancelar(reserva: Reserva): boolean {
    const estadosPermitidos = ['PENDIENTE', 'CONFIRMADA'];
    const estadoActual = reserva.estadoReserva || reserva.estadoReserva;
    return estadosPermitidos.includes(estadoActual || '');
  }

  getSeverity(estado: string): string {
    const severities: Record<string, string> = {
      'CONFIRMADA': 'success',
      'PENDIENTE': 'warning',
      'EN_PROCESO': 'info',
      'FINALIZADA': 'success',
      'CANCELADA': 'danger'
    };
    return severities[estado] || 'secondary';
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.cargarMisReservas(event);
  }

  irNuevaReserva(): void {
    this.router.navigate(['/dashboard/cliente/reservas/nueva']);
  }

  recargar(): void {
    this.cargarMisReservas();
  }
}
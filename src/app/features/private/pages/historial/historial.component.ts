import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../../core/services/operaciones/reserva-service';
import { HistorialClienteModel } from '../../../../core/models/operaciones/historial.cliente.model';
import { EstadoReserva } from '../../../../core/models/operaciones/EstadoReserva';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';

// Módulos de PrimeNG (¡Actualizados a v18+!)
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cliente-historial',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectModule,
    DatePickerModule,
    ButtonModule,
    DialogModule,
    ProgressSpinnerModule,
    TooltipModule,
    StatusBadgeComponent
  ],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class ClienteHistorialComponent implements OnInit {
  
  private reservaService = inject(ReservaService);

  historial: HistorialClienteModel[] = [];
  totalRecords: number = 0;
  loading: boolean = true;
  
  currentPage: number = 0;
  pageSize: number = 10;

  estadosOpciones: any[] = [
    { label: 'Todos', value: null },
    { label: 'Pendiente Pago', value: EstadoReserva.PENDIENTE_PAGO },
    { label: 'Confirmada', value: EstadoReserva.CONFIRMADA },
    { label: 'En Proceso', value: EstadoReserva.EN_PROCESO },
    { label: 'Finalizada', value: EstadoReserva.FINALIZADA },
    { label: 'Cancelada', value: EstadoReserva.CANCELADA }
  ];
  
  estadoSeleccionado: EstadoReserva | undefined = undefined;
  fechaDesde: Date | undefined;
  fechaHasta: Date | undefined;

  displayModal: boolean = false;
  reservaSeleccionada: HistorialClienteModel | null = null;

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.loading = true;
    this.reservaService.getHistorialCliente(
      this.currentPage,
      this.pageSize,
      this.estadoSeleccionado,
      this.fechaDesde,
      this.fechaHasta
    ).subscribe({
      next: (response) => {
        this.historial = response.data.content;
        this.totalRecords = response.data.totalElements;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el historial', err);
        this.loading = false;
      }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.currentPage = Math.floor((event.first ?? 0) / (event.rows ?? 10));
    this.pageSize = event.rows ?? 10;
    this.cargarHistorial();
  }

  aplicarFiltros(): void {
    this.currentPage = 0; 
    this.cargarHistorial();
  }

  limpiarFiltros(): void {
    this.estadoSeleccionado = undefined;
    this.fechaDesde = undefined;
    this.fechaHasta = undefined;
    this.currentPage = 0;
    this.cargarHistorial();
  }

  verDetalle(reserva: HistorialClienteModel): void {
    this.reservaSeleccionada = reserva;
    this.displayModal = true;
  }
}
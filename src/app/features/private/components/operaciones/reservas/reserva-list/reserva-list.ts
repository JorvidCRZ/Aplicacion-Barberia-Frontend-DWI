import { ApiResponse, Page } from '@/app/core/models/common/index.model';
import { Reserva } from '@/app/core/models/operaciones/Reserva.model';
import { ReservaService } from '@/app/core/services/operaciones/reserva.service';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-reserva-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TableModule, DialogModule],
  templateUrl: './reserva-list.html',
  styleUrls: ['./reserva-list.css'],
})
export class ReservaList implements OnInit {
  private router = inject(Router);
  private reservaService = inject(ReservaService);

  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  loading = false;
  totalRecords = 0;
  rows = 10;
  currentPage = 0;

  filtros = {
    cliente: '',
    barbero: '',
    estado: '',
    fecha: ''
  };
  showDetalle = false;
reservaSeleccionada: Reserva | null = null;

verDetalle(reserva: Reserva): void {
  this.reservaSeleccionada = reserva;
  this.showDetalle = true;
}

 

  get totalFiltrados(): number {
  return this.reservasFiltradas.length;
}

ngOnInit(): void {
  this.loadReservas();
}

loadReservas(event?: TableLazyLoadEvent): void {
  this.loading = true;

  
  if (event) {
    this.rows = event.rows ?? this.rows;
    this.currentPage = event.first != null ? Math.floor((event.first ?? 0) / this.rows) : 0;
    this.reservaService.getReservas(this.currentPage, this.rows)
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response: ApiResponse<Page<Reserva>>) => {
          if (response.success && response.data) {
            this.reservas = response.data.content;
            this.totalRecords = response.data.totalElements ?? this.reservas.length;
            this.aplicarFiltros();
          }
        },
        error: () => {
          this.reservas = [];
          this.reservasFiltradas = [];
        }
      });
    return;
  }

  
  this.reservaService.getReservas(0, 1000)
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (response: ApiResponse<Page<Reserva>>) => {
        if (response.success && response.data) {
          this.reservas = response.data.content;
          this.aplicarFiltros();
        }
      },
      error: () => {
        this.reservas = [];
        this.reservasFiltradas = [];
      }
    });
}

aplicarFiltros(): void {
  this.reservasFiltradas = this.reservas.filter(r => {
    const okCliente = !this.filtros.cliente ||
      r.clienteNombre?.toLowerCase().includes(this.filtros.cliente.toLowerCase());
    const okBarbero = !this.filtros.barbero ||
      r.barberoNombre === this.filtros.barbero;
    const okEstado = !this.filtros.estado ||
      r.estadoReserva === this.filtros.estado;
    const okFecha = !this.filtros.fecha ||
      (r.fecha != null && new Date(r.fecha).toISOString().split('T')[0] === this.filtros.fecha);
    return okCliente && okBarbero && okEstado && okFecha;
  });
}

 
  get barberosList(): string[] {
  return [...new Set(this.reservas.map(r => r.barberoNombre).filter(Boolean))].sort();
}

  

  get hayFiltrosActivos(): boolean {
    return !!(this.filtros.cliente || this.filtros.barbero || this.filtros.estado || this.filtros.fecha);
  }

  limpiarFiltro(campo: keyof typeof this.filtros): void {
    this.filtros[campo] = '';
    this.aplicarFiltros();
  }

  limpiarTodosFiltros(): void {
    this.filtros = { cliente: '', barbero: '', estado: '', fecha: '' };
    this.aplicarFiltros();
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.loadReservas(event);
  }

  irNuevaReserva(): void {
    this.router.navigate(['/dashboard/admin/operaciones/reservas/nueva']);
  }

  

  editarReserva(reserva: Reserva): void {
    this.router.navigate([`/dashboard/admin/operaciones/reservas/editar/${reserva.id}`]);
  }

  getEstadoClass(estado: string | null): string {
    switch (estado) {
      case 'CONFIRMADA':  return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDIENTE':   return 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20';
      case 'COMPLETADA':  return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'CANCELADA':   return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:            return 'bg-[#333333]/50 text-[#666666] border-[#333333]';
    }
  }
}
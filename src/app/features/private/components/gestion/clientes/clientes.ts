import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderClient } from './components/header-client/header-client';
import { ResumenGeneralClient } from './components/resumen-general-client/resumen-general-client';
import { FiltrarClients } from './components/filtrar-clients/filtrar-clients';
import { TableClient } from './components/table-client/table-client';
import { ClienteService } from '@/app/core/services/gestion/cliente.service';
import { ClienteFilterCriteria, ClienteFilterMode } from '@/app/core/models/gestion/cliente/cliente-filter.model';
import { Cliente } from '@/app/core/models/gestion/cliente/cliente.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [HeaderClient, ResumenGeneralClient, FiltrarClients, TableClient],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})
export class Clientes implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private clienteService = inject(ClienteService);
  private readonly pageSize = 7;

  icono: string = 'pi-users';
  activeFilter: ClienteFilterMode = 'todos';
  searchTerm: string = '';
  filterCriteria: ClienteFilterCriteria = {
    mode: 'todos',
    year: null,
    month: null,
    fromDate: '',
    toDate: '',
  };
  clients: Cliente[] = [];
  visibleClients: Cliente[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(page: number = 0): void {
    this.cargarClientesBase(page);
  }

  private cargarClientesBase(page: number = 0): void {
    this.clienteService.listar(page, this.pageSize).subscribe({
      next: (response) => this.aplicarRespuestaListado(response, page),
      error: (error) => console.error('Error al cargar clientes', error),
    });
  }

  onPrevPage(): void {
    if (this.currentPage <= 0) return;
    this.cargarPaginaActual(this.currentPage - 1);
  }

  onNextPage(): void {
    if (this.currentPage >= this.totalPages - 1) return;
    this.cargarPaginaActual(this.currentPage + 1);
  }

  abrirCrear() {
    this.router.navigate(['register-cliente'], { relativeTo: this.route });
  }

  onFilterChange(criteria: ClienteFilterCriteria) {
    this.searchTerm = '';
    this.filterCriteria = criteria;
    this.activeFilter = criteria.mode;
    this.cargarClientesFiltrados(0, criteria);
  }

  onSearch(query: string): void {
    this.searchTerm = query;
    this.cargarPaginaActual(0);
  }

  get isSearchActive(): boolean {
    return this.searchTerm.trim().length > 0;
  }

  onDisableCliente(id: number): void {
    this.clienteService.deshabilitar(id).subscribe({
      next: () => this.cargarPaginaActual(this.currentPage),
      error: (error) => console.error('Error al deshabilitar cliente', error),
    });
  }

  onReactivateCliente(id: number): void {
    this.clienteService.reactivar(id).subscribe({
      next: () => this.cargarPaginaActual(this.currentPage),
      error: (error) => console.error('Error al reactivar cliente', error),
    });
  }

  onCustomModeChange(isCustomMode: boolean): void {
    if (isCustomMode) {
      this.searchTerm = '';
      this.activeFilter = 'personalizado';
      this.filterCriteria = {
        mode: 'personalizado',
        year: null,
        month: null,
        fromDate: '',
        toDate: '',
      };
      this.cargarClientesBase(0);
      return;
    }

    this.activeFilter = this.filterCriteria.mode === 'personalizado' ? 'todos' : this.filterCriteria.mode;
  }

  private cargarClientesFiltrados(page: number, criteria: ClienteFilterCriteria): void {
    const size = this.pageSize;

    if (criteria.mode === 'todos') {
      this.clienteService.listar(page, size).subscribe({
        next: (response) => this.aplicarRespuestaListado(response, page),
        error: (error) => console.error('Error al cargar clientes', error),
      });
      return;
    }

    if (criteria.mode === 'recientes' || criteria.mode === 'mes' || criteria.mode === 'anio') {
      this.clienteService.filtrarPorTipo(criteria.mode, page, size).subscribe({
        next: (response) => this.aplicarRespuestaListado(response, page),
        error: (error) => console.error('Error al filtrar clientes', error),
      });
      return;
    }

    if (criteria.mode === 'deshabilitados') {
      this.clienteService.listarInhabilitados(page, size).subscribe({
        next: (response) => this.aplicarRespuestaListado(response, page),
        error: (error) => console.error('Error al cargar clientes inhabilitados', error),
      });
      return;
    }

    const rango = this.obtenerRangoPersonalizado(criteria);

    if (rango) {
      this.clienteService.filtrarPorRango(rango.fechaInicio, rango.fechaFin, page, size).subscribe({
        next: (response) => this.aplicarRespuestaListado(response, page),
        error: (error) => console.error('Error al filtrar clientes por rango', error),
      });
    }
  }

  private cargarPaginaActual(page: number): void {
    const search = typeof this.searchTerm === 'string' ? this.searchTerm.trim() : '';

    if (search) {
      this.clienteService.buscarPorNombre(search, page, this.pageSize).subscribe({
        next: (response) => this.aplicarRespuestaListado(response, page),
        error: (error) => console.error('Error al buscar clientes', error),
      });
      return;
    }

    this.cargarClientesFiltrados(page, this.filterCriteria);
  }

  private obtenerRangoPersonalizado(criteria: ClienteFilterCriteria): { fechaInicio: string; fechaFin: string } | null {
    if (criteria.fromDate && criteria.toDate) {
      return {
        fechaInicio: criteria.fromDate,
        fechaFin: criteria.toDate,
      };
    }

    if (criteria.year === null && criteria.month === null) {
      return null;
    }

    const year = criteria.year ?? new Date().getFullYear();

    if (criteria.month !== null) {
      const firstDay = new Date(year, criteria.month - 1, 1);
      const lastDay = new Date(year, criteria.month, 0);

      return {
        fechaInicio: this.formatearFecha(firstDay),
        fechaFin: this.formatearFecha(lastDay),
      };
    }

    const firstDayYear = new Date(year, 0, 1);
    const lastDayYear = new Date(year, 11, 31);

    return {
      fechaInicio: this.formatearFecha(firstDayYear),
      fechaFin: this.formatearFecha(lastDayYear),
    };
  }

  private formatearFecha(fecha: Date): string {
    return fecha.toISOString().slice(0, 10);
  }

  private aplicarRespuestaListado(response: any, page: number): void {
    this.clients = response.data.content;
    this.visibleClients = response.data.content;
    this.totalElements = response.data.totalElements;
    this.currentPage = response.data.pageNumber ?? page;
    this.totalPages = response.data.totalPages;
  }
}

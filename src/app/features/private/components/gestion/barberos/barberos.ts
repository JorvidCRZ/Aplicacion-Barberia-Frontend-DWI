import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BarberoService, FiltroBarberoBusqueda, DireccionOrden, OrdenarBarberoPor } from '@/app/core/services/gestion/barbero.service';
import { HeaderBarbero } from "./components/header-barbero/header-barbero";
import { ResumenGeneralBarberoComponent } from './components/resumen-general-barbero/resumen-general-barbero';
import { TableBarbero } from './components/table-barbero/table-barbero';
import { FiltrarBarbero } from "./components/filtrar-barbero/filtrar-barbero";

@Component({
  selector: 'app-barberos',
  imports: [HeaderBarbero, ResumenGeneralBarberoComponent, TableBarbero, FiltrarBarbero],
  templateUrl: './barberos.html',
  styleUrl: './barberos.css',
})
export class Barberos implements OnInit {

  icono: string = 'pi-users';
  searchTerm: string = '';
  inhabilitadosMode: boolean = false;
  private filtrosActuales: FiltroBarberoBusqueda = {};

  barberos: any[] = [];
  totalElements: number = 0;
  currentPage: number = 0;
  totalPages: number = 0;

  private barberoService = inject(BarberoService);

  ngOnInit(): void {
    this.loadPage(0);
  }

  private extraerPersona(b: any): { persona: any; nombre: string; apellido: string; email: string } {
    const personaRaw = b?.persona ?? b?.personaResponse ?? b?.personaDto ?? b?.personaDTO ?? {};

    const nombre = (personaRaw?.nombre ?? b?.nombre ?? b?.nombres ?? b?.personaNombre ?? '').toString().trim();
    const apellido = (personaRaw?.apellido ?? b?.apellido ?? b?.apellidos ?? b?.personaApellido ?? '').toString().trim();
    const email = (personaRaw?.email ?? personaRaw?.correo ?? b?.email ?? b?.correo ?? '').toString().trim();

    return {
      persona: {
        ...personaRaw,
        nombre,
        apellido,
        email,
      },
      nombre,
      apellido,
      email,
    };
  }

  private mapBarberos(content: any[]): any[] {
    return content.map((b: any) => {
      const p = this.extraerPersona(b);
      return {
        barberoId: b.barberoId || b.id,
        persona: p.persona,
        nombre: p.nombre,
        apellido: p.apellido,
        email: p.email,
        fechaIngreso: b.fechaIngreso ? new Date(b.fechaIngreso).toLocaleDateString() : '—',
        experiencia: b.experiencia != null ? `${b.experiencia} años` : '—',
        estado: b.ocupado ? 'Ocupado' : 'Disponible',
        comision: b.comision != null ? `${b.comision}%` : '—',
        sueldo: b.sueldo != null ? `S/${b.sueldo}` : '—'
      };
    });
  }

  private aplicarPagina(res: any): void {
    if (!res || !res.success) return;
    const p = res.data;
    this.barberos     = this.mapBarberos(p.content || []);
    this.totalElements = p.totalElements || 0;
    this.currentPage  = p.pageNumber || 0;
    this.totalPages   = p.totalPages || 0;
  }

  loadPage(page: number = 0, size: number = 10, filtros: FiltroBarberoBusqueda = this.filtrosActuales): void {
    const useFilters = Boolean(filtros.estado || filtros.ordenarPor || filtros.direccion);
    const request$ = useFilters
      ? this.barberoService.buscar(filtros, page, size)
      : this.barberoService.listar(page, size);

    request$.subscribe((res: any) => this.aplicarPagina(res));
  }

  onSearch(query: string): void {
    this.searchTerm = query.trim();

    if (this.searchTerm) {
      this.buscarBarberosPorNombre(this.searchTerm);
    } else {
      if (this.inhabilitadosMode) {
        this.onShowInhabilitados();
        return;
      }

      // Campo vacío → volver al listado normal con filtros activos
      this.loadPage(0, 10, this.filtrosActuales);
    }
  }

  onApplyFilters(filters: { estado: string; order: string }): void {
    this.inhabilitadosMode = false;
    const parsed = this.parseOrder(filters.order);
    this.filtrosActuales = {
      estado: (filters.estado as FiltroBarberoBusqueda['estado']) || 'todos',
      ordenarPor: parsed.ordenarPor,
      direccion: parsed.direccion
    };
    this.loadPage(0, 10, this.filtrosActuales);
  }

  onClearFilters(): void {
    this.inhabilitadosMode = false;
    this.filtrosActuales = {};
    this.loadPage(0, 10, {});
  }

  onShowInhabilitados(): void {
    this.searchTerm = '';
    this.inhabilitadosMode = true;
    this.filtrosActuales = {};
    this.barberoService.listarInhabilitados(0, 10).subscribe((res: any) => this.aplicarPagina(res));
  }

  onDisableBarbero(id: number): void {
    this.barberoService.deshabilitar(id).subscribe({
      next: () => this.inhabilitadosMode ? this.onShowInhabilitados() : this.loadPage(this.currentPage, 10, this.filtrosActuales),
      error: (error) => console.error('Error al deshabilitar barbero', error),
    });
  }

  onReactivateBarbero(id: number): void {
    this.barberoService.reactivar(id).subscribe({
      next: () => this.onShowInhabilitados(),
      error: (error) => console.error('Error al reactivar barbero', error),
    });
  }

  private buscarBarberosPorNombre(termino: string): void {
    forkJoin({
      activos: this.barberoService.buscarPorNombre(termino, 0, 10),
      inhabilitados: this.barberoService.listarInhabilitados(0, 10),
    }).subscribe({
      next: ({ activos, inhabilitados }) => {
        const texto = termino.toLowerCase();
        const activosContent = activos?.data?.content || [];
        const inhabilitadosContent = inhabilitados?.data?.content || [];

        const combinados = [...activosContent, ...inhabilitadosContent].filter((b: any) => {
          const p = this.extraerPersona(b);
          const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
          const correo = p.email.toLowerCase();
          return nombreCompleto.includes(texto) || correo.includes(texto);
        });

        const unicos = Array.from(
          new Map(combinados.map((b: any) => [b.barberoId || b.id, b])).values()
        );

        this.aplicarPagina({
          success: true,
          data: {
            content: unicos,
            totalElements: unicos.length,
            pageNumber: 0,
            totalPages: 1,
          },
        });
      },
      error: (error) => console.error('Error al buscar barberos', error),
    });
  }

  private parseOrder(order: string): { ordenarPor?: OrdenarBarberoPor; direccion?: DireccionOrden } {
    if (!order) return {};
    const [ordenarPor, direccion] = order.split('_');
    const allowedOrder     = ['fechaIngreso', 'experiencia', 'sueldo', 'comision'] as const;
    const allowedDirection = ['asc', 'desc'] as const;
    return {
      ordenarPor: allowedOrder.includes(ordenarPor as OrdenarBarberoPor) ? (ordenarPor as OrdenarBarberoPor) : undefined,
      direccion:  allowedDirection.includes(direccion as DireccionOrden)  ? (direccion as DireccionOrden)     : undefined
    };
  }

  abrirCrear(): void { }

  onPrev(): void {
    if (this.currentPage > 0) this.loadPage(this.currentPage - 1, 10, this.filtrosActuales);
  }

  onNext(): void {
    if (this.currentPage < this.totalPages - 1) this.loadPage(this.currentPage + 1, 10, this.filtrosActuales);
  }
}
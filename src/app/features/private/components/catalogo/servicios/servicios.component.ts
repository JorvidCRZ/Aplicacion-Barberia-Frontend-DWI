import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { DialogHeaderComponent } from '@/app/shared/components/dialog-header/dialog-header.component';
import { ServicioFormComponent } from './servicio-form/servicio-form.component';
import { ServicioTableComponent } from './servicio-table/servicio-table.component';
import { CommonModule } from '@angular/common';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ServicioService } from '@/app/core/services/catalogos/servicio.service';
import { Servicio, ServicioRequest } from '@/app/core/models/catalogos/servicios.model';
import { Categoria, CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { ServicioFiltro } from '@/app/core/models/catalogos/servicios.model';
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { FILTROS_SERVICIO } from '@/app/core/config/filtros.config';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { buildCategoryTree } from '@/app/shared/utils/buildCategoryTree.component';

@Component({
  selector: 'app-servicios',
  imports: [ServicioFormComponent, ServicioTableComponent, DialogModule, ButtonModule,
    CommonModule, FormsModule, SearchBarComponent, DialogHeaderComponent, FiltrosComponent],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent implements OnInit {
  private cd = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);
  private servicioService = inject(ServicioService);
  private categoriaService = inject(CategoriaService);

  servicios: Servicio[] = [];
  categorias: Categoria[] = [];
  servicioSeleccionado: Servicio | null = null;

  filtrosFields = [...FILTROS_SERVICIO];
  filtro: Partial<ServicioFiltro> = {};
  cargandoEstado: Set<number> = new Set();
  publicadoAnterior: Set<number> = new Set();
  rows = 30;
  pageActual = 0;
  cargado = false;
  totalRecords = 0;
  resetFormTrigger = 0;
  mostrarFormulario = false;
  icono = 'pi-sparkles';
  texto = 'Servicios';

  ngOnInit() {
    this.cargarCategorias();
    this.cargarServicios(0, this.rows);
  }

  cargarServicios(page: number, size: number): void {
    this.pageActual = page;
    this.cargado = false;
    this.filtro = { ...this.filtro, page, size };
    this.servicioService.obtenerServiciosConFiltro(this.filtro).subscribe({
      next: (resp) => {
        this.servicios = resp.data.content;
        this.totalRecords = resp.data.totalElements;
        this.cargado = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.notify.showHttpError(err.message);
        this.cargado = true;
      }
    });
  }

  buscarServicios(nombre: string): void {
    this.filtro.nombre = nombre;
    this.cargarServicios(0, this.rows);
  }

  guardarServicio(event: { data: ServicioRequest, imagenes?: File[] | null }) {
    if (this.servicioSeleccionado) { this.editarServicio(event.data, event.imagenes || undefined); }
    else { this.crearServicio(event.data, event.imagenes || undefined); }
  }

  private crearServicio(data: ServicioRequest, imagenes?: File[]) {
    this.servicioService.crearServicio(data, imagenes).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err.message); },
    });
  }

  private editarServicio(data: ServicioRequest, imagenes?: File[]) {
    if (!this.servicioSeleccionado) return;
    this.servicioService.actualizarServicio(this.servicioSeleccionado.servicioId, data, imagenes).subscribe({
      next: () => this.postGuardar('Servicio actualizado correctamente'),
      error: (err) => this.notify.showHttpError(err.message)
    });
  }

  onCambiarEstado(event: { id: number, activo: boolean }) {
    if (this.cargandoEstado.has(event.id)) return;
    const producto = this.servicios.find(p => p.servicioId === event.id);
    if (!producto) return;
    const estadoAnterior = producto.estado;
    producto.estado = event.activo;
    this.cargandoEstado.add(event.id);
    this.servicioService.cambiarEstado(event.id, event.activo).subscribe({
      next: () => { this.notify.showSuccess(`Servicio ${event.activo ? 'activado' : 'desactivado'} exitosamente`); },
      error: (err) => {
        producto.estado = estadoAnterior;
        this.notify.showHttpError(err.message);
      },
      complete: () => { this.cargandoEstado.delete(event.id); }
    });
  }

  onCambiarPublicado(event: { id: number, publicado: boolean }) {
    if (this.publicadoAnterior.has(event.id)) return;
    const producto = this.servicios.find(p => p.servicioId === event.id);
    if (!producto) return;
    const publicadoAnterior = producto.publicado;
    producto.publicado = event.publicado;
    this.publicadoAnterior.add(event.id);
    this.servicioService.cambiarPublicado(event.id, event.publicado).subscribe({
      next: () => { this.notify.showSuccess(`Servicio ${event.publicado ? 'publicado' : 'no publicado'} exitosamente`); },
      error: (err) => {
        producto.publicado = publicadoAnterior;
        this.notify.showHttpError(err.message);
      },
      complete: () => { this.publicadoAnterior.delete(event.id); }
    });
  }

  eliminarServicio(servicio: Servicio) {
    this.servicioService.eliminarServicio(servicio.servicioId).subscribe({
      next: () => {
        this.notify.showSuccess('Servicio eliminado');
        this.cargarServicios(0, this.rows);
      },
      error: (err) => this.notify.showHttpError(err.message)
    });
  }

  abrirCrear() {
    this.servicioSeleccionado = null;
    this.mostrarFormulario = true;
  }

  abrirEditar(servicio: Servicio) {
    this.servicioSeleccionado = { ...servicio };
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.servicioSeleccionado = null;
  }

  onDialogHide() {
    this.servicioSeleccionado = null;
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 30;
    const page = Math.floor(first / rows);
    this.cargarServicios(page, rows);
  }

  private postGuardar(mensaje: string) {
    this.notify.showSuccess(mensaje);
    this.cargarServicios(0, this.rows);
    this.resetFormTrigger++;
    this.cerrarFormulario();
  }

  private cargarCategorias() {
    this.categoriaService.obtenerCategoriasPorTipo(CategoriaTipo.SERVICIO)
      .subscribe({
        next: (resp) => {
          this.categorias = resp.data.content;
          const nodos = buildCategoryTree(this.categorias);
          this.filtrosFields = this.filtrosFields.map(filtro => filtro.key === 'categoriaId' ? { ...filtro, treeOptions: nodos } : filtro);
          this.cargarServicios(0, this.rows);
        },
        error: (err) => {
          this.notify.showHttpError(err.message);
          this.cargarServicios(0, this.rows);
        }
      });
  }

  onBuscar(filtros: Partial<ServicioFiltro>) {
    if (filtros.categoriaId && typeof filtros.categoriaId === 'object') {
      const nodo = filtros.categoriaId as any;
      filtros.categoriaId = nodo.key ?? nodo.data?.id ?? undefined;
    }
    this.filtro = { ...this.filtro, ...filtros };
    this.cargarServicios(0, this.rows);
  }

  onLimpiar() {
    this.filtro = { page: 0, size: this.rows };
    this.cargarServicios(0, this.rows);
  }
}

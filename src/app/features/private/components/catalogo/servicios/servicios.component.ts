import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { tap } from 'rxjs';

@Component({
  selector: 'app-servicios',
  imports: [ServicioFormComponent, ServicioTableComponent, DialogModule, ButtonModule,
    CommonModule, FormsModule, SearchBarComponent, DialogHeaderComponent],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})
export class ServiciosComponent {
  private cd = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);
  private servicioService = inject(ServicioService);
  private categoriaService = inject(CategoriaService);


  servicios: Servicio[] = [];
  categorias: Categoria[] = [];
  servicioSeleccionado: Servicio | null = null;

  rows = 30;
  pageActual = 0;
  cargado = false;
  totalRecords = 0;
  resetFormTrigger = 0;
  mostrarFormulario = false;
  icono = 'pi-sparkles';

  filtro: any = {};

  ngOnInit() {
    this.cargarCategorias();
    this.cargarServicios(0, this.rows);
  }

  cargarServicios(page: number, size: number): void {
    this.pageActual = page;
    this.cargado = false;

    this.servicioService.obtenerServicios().subscribe({
      next: (resp) => {
        this.servicios = resp;
        this.totalRecords = resp.length;
        this.cargado = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.notify.showError(err.message);
        this.cargado = true;
      }
    });
  }

  buscarServicios(nombre: string): void {
    this.filtro.nombre = nombre;
    this.cargarServicios(0, this.rows);
  }

  guardarServicio(event: { data: ServicioRequest, imagenes?: File[] }) {
    if (this.servicioSeleccionado) {
      this.editarServicio(event.data);
    } else {
      this.crearServicio(event.data);
    }
  }

  private crearServicio(data: ServicioRequest, imagenes?: File[]) {
    this.servicioService.crearServicio(data, imagenes).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err); },
    });
  }

  private editarServicio(data: ServicioRequest) {
    if (!this.servicioSeleccionado) return;
    this.servicioService.actualizarServicio(this.servicioSeleccionado.servicioId, data).subscribe({
      next: () => this.postGuardar('Servicio actualizado correctamente'),
      error: (err) => this.notify.showHttpError(err)
    });
  }

  eliminarServicio(servicio: Servicio) {
    this.servicioService.eliminarServicio(servicio.servicioId).subscribe({
      next: () => {
        this.notify.showSuccess('Servicio eliminado');
        this.cargarServicios(0, this.rows);
      },
      error: (err) => this.notify.showHttpError(err)
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
    this.categoriaService.obtenerCategoriasPorTipo(CategoriaTipo.SERVICIO).pipe(
      tap(resp => this.categorias = resp.data.content)
    ).subscribe({
      next: () => this.cargarServicios(0, this.rows),
      error: (err) => {
        this.notify.showHttpError(err);
        this.cargarServicios(0, this.rows);
      }
    });
  }
}

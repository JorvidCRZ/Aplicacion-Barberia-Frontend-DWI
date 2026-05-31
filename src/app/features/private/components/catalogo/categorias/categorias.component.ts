import { CategoriaTableComponent } from './categoria-table/categoria-table.component';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { DialogHeaderComponent } from '@/app/shared/components/dialog-header/dialog-header.component';
import { CategoriaFormComponent } from './categoria-form/categoria-form.component';
import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { Categoria, CategoriaFilter } from '@/app/core/models/catalogos/categorias.model';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [
    CategoriaTableComponent, CategoriaFormComponent, DialogModule, ButtonModule,
    CommonModule, FormsModule, SearchBarComponent, DialogHeaderComponent
  ],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {

  private categoriaService = inject(CategoriaService);
  private notify = inject(NotificationService);
  private cd = inject(ChangeDetectorRef);

  categoriaSeleccionada: Categoria | null = null;
  categorias: Categoria[] = [];
  filtro: CategoriaFilter = {};
  mostrarFormulario: boolean = false;
  cargandoEstado: Set<number> = new Set();
  rows = 25;
  pageActual = 0;
  cargado = false;
  totalRecords = 0;
  icono = 'pi-tags';

  ngOnInit() {
    this.cargarCategorias(0, this.rows);
  }

  cargarCategorias(page: number, size: number): void {
    this.pageActual = page;
    this.cargado = false;
    this.categoriaService.obtenerCategoriasConFiltro({ ...this.filtro, page, size }).subscribe({
      next: (resp) => {
        this.categorias = resp.data.content;
        this.totalRecords = resp.data.totalElements;
        this.cargado = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.notify.showHttpError(err);
        this.cargado = true;
      }
    });
  }

  buscarCategorias(nombre: string): void {
    this.filtro.nombre = nombre;
    this.cargarCategorias(0, this.rows);
  }

  guardarCategoria(data: Categoria) {
    if (this.categoriaSeleccionada) { this.editarCategoria(data); }
    else { this.crearCategoria(data); }
  }

  eliminarCategoria(categoria: Categoria) {
    this.categoriaService.eliminarCategoria(categoria.id).subscribe({
      next: (resp) => {
        this.categoriaService.clearCategoriasCache();
        this.notify.showSuccess(resp.message);
        this.cargarCategorias(0, this.rows);
      },
      error: (err) => this.notify.showHttpError(err)
    });
  }

  abrirCrear() {
    this.categoriaSeleccionada = null;
    this.mostrarFormulario = true;
  }

  abrirEditar(categoria: Categoria) {
    this.mostrarFormulario = true;
    this.categoriaSeleccionada = categoria;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.categoriaSeleccionada = null;
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 25;
    const page = Math.floor(first / rows);
    const size = rows;
    this.cargarCategorias(page, size);
  }

  private postGuardar(mensaje: string) {
    this.categoriaService.clearCategoriasCache();
    this.notify.showSuccess(mensaje);
    this.cargarCategorias(0, this.rows);
    this.cerrarFormulario();
  }

  private crearCategoria(data: Categoria) {
    this.categoriaService.crearCategoria(data).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err); },
    });
  }

  onCambiarEstado(event: { id: number, activo: boolean }) {
    if (this.cargandoEstado.has(event.id)) return;
    const categoria = this.findCategoriaById(event.id, this.categorias);
    if (!categoria) return;
    const estadoAnterior = categoria.estado;
    categoria.estado = event.activo;
    this.cargandoEstado.add(event.id);
    this.categoriaService.cambiarEstado(event.id, event.activo).subscribe({
      next: () => {
        this.notify.showSuccess(`Categoría ${event.activo ? 'activada' : 'desactivada'} exitosamente`);
      },
      error: (err: any) => {
        categoria.estado = estadoAnterior;
        this.notify.showHttpError(err);
      },
      complete: () => { this.cargandoEstado.delete(event.id); }
    });
  }

  private findCategoriaById(id: number, list: Categoria[] | undefined): Categoria | null {
    if (!list || list.length === 0) return null;
    for (const cat of list) {
      if (cat.id === id) return cat;
      if (cat.subcategorias && cat.subcategorias.length) {
        const found = this.findCategoriaById(id, cat.subcategorias);
        if (found) return found;
      }
    }
    return null;
  }

  private editarCategoria(data: Categoria) {
    if (!this.categoriaSeleccionada) return;
    this.categoriaService.actualizarCategoria(this.categoriaSeleccionada.id, data).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err); },
    });
  }
}
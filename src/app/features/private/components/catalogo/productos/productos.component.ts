import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { ProductoFormComponent } from './producto-form/producto-form.component';
import { ProductoTableComponent } from './producto-table/producto-table.component';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { DialogHeaderComponent } from '@/app/shared/components/dialog-header/dialog-header.component';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { Producto, ProductoFiltro, ProductoRequest } from '@/app/core/models/catalogos/productos.model';
import { Categoria, CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { FILTROS_PRODUCTO } from '@/app/core/config/filtros.config';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { buildCategoryTree } from '@/app/shared/utils/buildCategoryTree.component';

@Component({
  selector: 'app-productos',
  imports: [ProductoFormComponent, ProductoTableComponent, DialogModule, ButtonModule,
    CommonModule, FormsModule, SearchBarComponent, DialogHeaderComponent, FiltrosComponent],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class ProductosComponent implements OnInit {

  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private notify = inject(NotificationService);
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);

  productoSeleccionado: Producto | null = null;
  filtro: Partial<ProductoFiltro> = {};
  categorias: Categoria[] = [];
  productos: Producto[] = [];

  filtrosFields = [...FILTROS_PRODUCTO];
  rows = 30;
  pageActual = 0;
  cargado = false;
  totalRecords = 0;
  resetFormTrigger = 0;
  mostrarFormulario = false;
  modo: 'crear' | 'editar' | 'ver' | null = null;
  cargandoEstado: Set<number> = new Set();
  publicadoAnterior: Set<number> = new Set();
  icono = 'pi-th-large';
  texto = 'Productos';

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProductos(0, this.rows);
  }

  cargarProductos(page: number, size: number): void {
    this.pageActual = page;
    this.cargado = false;
    this.productoService.obtenerProductosConFiltro({ ...this.filtro, page, size, sort: 'id,desc' }).subscribe({
      next: (resp) => {
        this.productos = resp.data.content;
        this.totalRecords = resp.data.totalElements;
        this.cargado = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.notify.showHttpError(err.message);
        this.cargado = true;
        this.cd.detectChanges();
      }
    });
  }

  buscarProductos(nombre: string): void {
    this.filtro.nombre = nombre;
    this.cargarProductos(0, this.rows);
  }

  guardarProducto(event: { data: ProductoRequest, imagenes?: File[] | null }) {
    if (this.productoSeleccionado) { this.editarProducto(event.data, event.imagenes || undefined); }
    else { this.crearProducto(event.data, event.imagenes || undefined); }
  }

  eliminarProducto(producto: Producto) {
    this.productoService.eliminarProducto(producto.id).subscribe({
      next: (resp) => {
        this.notify.showSuccess(resp.message);
        this.cargarProductos(0, this.rows);
      },
      error: (err) => this.notify.showHttpError(err.message),
    });
  }

  abrirVer(id: number) {
    this.router.navigate(['/dashboard/admin/catalogo/productos/detalle', id]);
  }

  abrirCrear() {
    this.modo = 'crear';
    this.productoSeleccionado = null;
    this.cargarCategorias();
    this.mostrarFormulario = true;
    this.cd.detectChanges();
  }

  abrirEditar(producto: Producto) {
    this.productoSeleccionado = { ...producto };
    this.modo = 'editar';
    this.cargarCategorias();
    this.mostrarFormulario = true;
    this.cd.detectChanges();
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
    this.productoSeleccionado = null;
    this.modo = null;
  }


  private postGuardar(mensaje: string) {
    this.notify.showSuccess(mensaje);
    this.cargarProductos(0, this.rows);
    this.resetFormTrigger++;
    this.cerrarFormulario();
  }

  private crearProducto(data: ProductoRequest, imagenes?: File[]) {
    this.productoService.crearProducto(data, imagenes).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err.message); },
    });
  }

  private editarProducto(data: ProductoRequest, imagenes?: File[]) {
    if (!this.productoSeleccionado) return;
    this.productoService.actualizarProducto(this.productoSeleccionado.id, data, imagenes).subscribe({
      next: (resp) => { this.postGuardar(resp.message); },
      error: (err) => { this.notify.showHttpError(err.message); },
    });
  }

  onCambiarEstado(event: { id: number, activo: boolean }) {
    if (this.cargandoEstado.has(event.id)) return;
    const producto = this.productos.find(p => p.id === event.id);
    if (!producto) return;
    const estadoAnterior = producto.estado;
    producto.estado = event.activo;
    this.cargandoEstado.add(event.id);
    this.productoService.cambiarEstado(event.id, event.activo).subscribe({
      next: () => { this.notify.showSuccess(`Producto ${event.activo ? 'activado' : 'desactivado'} exitosamente`); },
      error: (err) => {
        producto.estado = estadoAnterior;
        this.notify.showHttpError(err.message);
      },
      complete: () => { this.cargandoEstado.delete(event.id); }
    });
  }

  onCambiarPublicado(event: { id: number, publicado: boolean }) {
    if (this.publicadoAnterior.has(event.id)) return;
    const producto = this.productos.find(p => p.id === event.id);
    if (!producto) return;
    const publicadoAnterior = producto.publicado;
    producto.publicado = event.publicado;
    this.publicadoAnterior.add(event.id);
    this.productoService.cambiarPublicado(event.id, event.publicado).subscribe({
      next: () => { this.notify.showSuccess(`Producto ${event.publicado ? 'publicado' : 'no publicado'} exitosamente`); },
      error: (err) => {
        producto.publicado = publicadoAnterior;
        this.notify.showHttpError(err.message);
      },
      complete: () => { this.publicadoAnterior.delete(event.id); }
    });
  }

  onLazyLoad(event: TableLazyLoadEvent) {
    const first = event.first ?? 0;
    const rows = event.rows ?? 25;
    const page = Math.floor(first / rows);
    const size = rows;
    this.cargarProductos(page, size);
  }

  private cargarCategorias(): void {
    this.categoriaService.obtenerCategoriasPorTipo(CategoriaTipo.PRODUCTO).subscribe({
      next: (resp) => {
        this.categorias = resp.data.content;
        const nodos = buildCategoryTree(this.categorias);
        this.filtrosFields = this.filtrosFields.map(field => field.key === 'idCategoria' ? { ...field, treeOptions: nodos } : field);
      },
      error: (err) => {
        this.notify.showHttpError(err.message);
      }
    });
  }

  onDialogHide() {
    if (this.modo === 'crear') { this.productoSeleccionado = null; }
  }

  onBuscar(filtros: Partial<ProductoFiltro>) {
    if (filtros.idCategoria && typeof filtros.idCategoria === 'object') {
      const nodo = filtros.idCategoria as any;
      filtros.idCategoria = nodo.key ?? nodo.data?.id ?? undefined;
    }
    this.filtro = { ...this.filtro, ...filtros };
    this.cargarProductos(0, this.rows);
  }

  onLimpiar() {
    this.filtro = { page: 0, size: this.rows };
    this.cargarProductos(0, this.rows);
  }
}

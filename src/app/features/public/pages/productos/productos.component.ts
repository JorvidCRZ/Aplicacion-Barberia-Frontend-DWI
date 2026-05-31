import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';
import { forkJoin } from 'rxjs';
import { Producto, ProductoFilter } from '@/app/core/models/catalogos/productos.model';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProductoListaComponent } from './producto-lista/producto-lista.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { INVENTARIO_CONFIG } from '@/app/core/config/valores.config';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-producto',
  imports: [CommonModule, FormsModule, ProductoListaComponent, PaginatorModule, InputNumberModule, TreeSelectModule, ButtonModule],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductComponent implements OnInit {

  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  
  readonly moneda = INVENTARIO_CONFIG.MONEDA;
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productosFiltradosCompletos: Producto[] = [];
  categorias: string[] = [];
  categoryTreeNodes: any[] = [];
  categoriaSeleccionada: any = null;
  cargando = true;
  modoFiltroLocal = false;
  page = 0;
  size = 12;
  totalRecords = 0;

  filtros: ProductoFilter = {
    nombre: '',
    idCategoria: undefined,
    precioMin: undefined,
    precioMax: undefined,
    publicado: true,
  };

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos(this.page, this.size);
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategoriasPorTipo(CategoriaTipo.PRODUCTO).subscribe({
      next: (resp) => {
        const cats = resp.data?.content ?? [];
        const productoCats = cats.filter(c => String(c.tipo).toUpperCase() === String(CategoriaTipo.PRODUCTO));
        this.categorias = productoCats.map(c => c.nombre).sort();
        this.categoryTreeNodes = this.buildCategoryTree(productoCats);
      },
      error: () => {
        this.categorias = [];
        this.categoryTreeNodes = [];
      }
    });
  }

  onCategoryNodeSelect(event: any): void {
    this.categoriaSeleccionada = event?.node ?? null;
    this.filtros.idCategoria = this.obtenerIdCategoriaSeleccionada(this.categoriaSeleccionada);
    const tieneHijos = Array.isArray(this.categoriaSeleccionada?.children) && this.categoriaSeleccionada.children.length > 0;
    if (tieneHijos) {
      const leafIds = this.obtenerIdsHojas(this.categoriaSeleccionada);
      this.modoFiltroLocal = true;
      this.page = 0;
      this.cargarProductosPorCategorias(leafIds);
      return;
    }
    this.modoFiltroLocal = false;
    this.cargarProductos(0, this.size);
  }

  onCategoryClear(): void {
    this.categoriaSeleccionada = null;
    this.filtros.idCategoria = undefined;
    this.modoFiltroLocal = false;
    this.productosFiltradosCompletos = [];
    this.cargarProductos(0, this.size);
  }

  private obtenerIdsHojas(nodo: any): number[] {
    if (!nodo) { return []; }
    const children = Array.isArray(nodo.children) ? nodo.children : [];
    if (children.length === 0) {
      const id = this.obtenerIdCategoriaSeleccionada(nodo);
      return id !== undefined ? [id] : [];
    }

    return children.flatMap((child: any) => this.obtenerIdsHojas(child));
  }

  private obtenerIdCategoriaSeleccionada(valor: any): number | undefined {
    if (valor == null) { return undefined; }
    if (typeof valor === 'number') { return valor; }
    if (typeof valor === 'object') {
      const key = valor.key ?? valor.data?.id ?? valor.id;
      if (key == null) { return undefined; }
      const parsed = Number(key);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    if (typeof valor === 'string' && valor.trim() !== '') {
      const parsed = Number(valor);
      return Number.isFinite(parsed) ? parsed : undefined;
    }
    return undefined;
  }

  private buildCategoryTree(cats: any[]): any[] {
    const makeNode = (c: any) => {
      const id = Number(c.id);
      const children = (c.subcategorias && c.subcategorias.length) ? c.subcategorias.map((sc: any) => makeNode(sc)) : [];
      const node: any = { label: c.nombre, key: id, data: c, children };
      if (children.length) { node.expanded = true; }
      return node;
    };

    const roots = cats.filter(c => c.padreId == null).map(c => makeNode(c));
    return roots;
  }

  cargarProductos(page = 0, size = this.size): void {
    this.cargando = true;
    const filter: any = { page, size, publicado: true };
    if (this.filtros.nombre) { filter.nombre = this.filtros.nombre; }
    if (this.filtros.idCategoria !== null && this.filtros.idCategoria !== undefined) { filter.idCategoria = this.filtros.idCategoria; }
    if (this.filtros.precioMin !== null && this.filtros.precioMin !== undefined) { filter.precioMin = this.filtros.precioMin; }
    if (this.filtros.precioMax !== null && this.filtros.precioMax !== undefined) { filter.precioMax = this.filtros.precioMax; }

    this.productoService.obtenerProductosPublico(filter).subscribe({
      next: (resp) => {
        this.productos = resp.data?.content ?? [];
        this.totalRecords = resp.data?.totalElements ?? this.productos.length;
        if (!this.categoryTreeNodes || this.categoryTreeNodes.length === 0) {
          this.categorias = [...new Set(this.productos.map(producto => producto.nombreCategoria).filter(Boolean))].sort();
        }
        this.productosFiltrados = this.productos;
        this.productosFiltradosCompletos = this.productos;
        this.cargando = false;
      },
      error: () => {
        this.productos = [];
        this.productosFiltrados = [];
        this.categorias = [];
        this.cargando = false;
      },
    });
  }

  private cargarProductosPorCategorias(categoriaIds: number[]): void {
    if (!categoriaIds.length) {
      this.productos = [];
      this.productosFiltrados = [];
      this.productosFiltradosCompletos = [];
      this.totalRecords = 0;
      this.cargando = false;
      return;
    }

    const requests = categoriaIds.map(idCategoria => {
      const filter: any = { page: 0, size: 1000, publicado: true, idCategoria };
      if (this.filtros.nombre) { filter.nombre = this.filtros.nombre; }
      if (this.filtros.precioMin !== null && this.filtros.precioMin !== undefined) { filter.precioMin = this.filtros.precioMin; }
      if (this.filtros.precioMax !== null && this.filtros.precioMax !== undefined) { filter.precioMax = this.filtros.precioMax; }
      return this.productoService.obtenerProductosPublico(filter);
    });

    forkJoin(requests).subscribe({
      next: (responses) => {
        const merged = responses.flatMap(resp => resp.data?.content ?? []);
        const unique = Array.from(new Map(merged.map(producto => [producto.id, producto])).values());
        this.productos = unique;
        this.productosFiltradosCompletos = unique;
        this.totalRecords = unique.length;
        this.page = 0;
        this.refrescarVistaLocal();
        this.cargando = false;
      },
      error: () => {
        this.productos = [];
        this.productosFiltrados = [];
        this.productosFiltradosCompletos = [];
        this.totalRecords = 0;
        this.cargando = false;
      },
    });
  }

  private refrescarVistaLocal(): void {
    const inicio = this.page * this.size;
    const fin = inicio + this.size;
    this.productosFiltrados = this.productosFiltradosCompletos.slice(inicio, fin);
  }

  aplicarFiltros(): void {
    const nombreBuscado = (this.filtros.nombre ?? '').trim().toLowerCase();
    this.productosFiltrados = this.productos.filter(producto => {
      const coincideNombre = !nombreBuscado || producto.nombre.toLowerCase().includes(nombreBuscado) || producto.descripcion.toLowerCase().includes(nombreBuscado);
      const coincideCategoria = !this.filtros.idCategoria || producto.idCategoria === this.filtros.idCategoria;
      const coincidePrecioMin = this.filtros.precioMin === undefined || producto.precio >= this.filtros.precioMin;
      const coincidePrecioMax = this.filtros.precioMax === undefined || producto.precio <= this.filtros.precioMax;
      return producto.publicado && coincideNombre && coincideCategoria && coincidePrecioMin && coincidePrecioMax;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      nombre: '',
      idCategoria: undefined,
      precioMin: undefined,
      precioMax: undefined,
      publicado: true,
    };
    this.categoriaSeleccionada = null;
    this.modoFiltroLocal = false;
    this.productosFiltrados = [];
    this.cargarProductos(0, this.size);
  }

  onPage(event: { page: number; size: number }) {
    this.page = event.page;
    this.size = event.size;
    if (this.modoFiltroLocal) {
      this.refrescarVistaLocal();
      return;
    }
    this.cargarProductos(this.page, this.size);
  }

  onPaginatorChange(event: PaginatorState): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? this.size;
    const page = Math.floor(first / rows);
    this.onPage({ page, size: rows });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.size));
  }

  get isFirstPage(): boolean {
    return this.page <= 0;
  }

  get isLastPage(): boolean {
    return this.page >= this.totalPages - 1;
  }

  irPaginaAnterior(): void {
    if (!this.isFirstPage) {
      this.onPage({ page: this.page - 1, size: this.size });
    }
  }

  irPaginaSiguiente(): void {
    if (!this.isLastPage) {
      this.onPage({ page: this.page + 1, size: this.size });
    }
  }
}

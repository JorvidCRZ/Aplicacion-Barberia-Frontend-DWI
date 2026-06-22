import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { PaginatorState } from 'primeng/paginator';
import { Producto, ProductoFiltro } from '@/app/core/models/catalogos/productos.model';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { CategoriaService } from '@/app/core/services/catalogos/categoria.service';
import { Categoria, CategoriaTipo } from '@/app/core/models/catalogos/categorias.model';
import { TreeSelectModule } from 'primeng/treeselect';
import { ProductoListaComponent } from './producto-lista/producto-lista.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { INVENTARIO_CONFIG } from '@/app/core/config/valores.config';
import { ButtonModule } from 'primeng/button';
import { FILTROS_PRODUCTO_PUBLICO } from '@/app/core/config/filtros.config';
import { FiltrosComponent } from '@/app/shared/components/filtros/filtros.component';
import { buildCategoryTree } from '@/app/shared/utils/buildCategoryTree.component';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  standalone: true,
  selector: 'app-producto',
  imports: [CommonModule, FormsModule, ProductoListaComponent, PaginatorModule, InputNumberModule, TreeSelectModule,
    ButtonModule, FiltrosComponent
  ],
  templateUrl: './productos.html',
  styleUrls: ['./productos.css'],
})
export class ProductComponent implements OnInit {

  private readonly productoService = inject(ProductoService);
  private readonly categoriaService = inject(CategoriaService);
  private readonly notify = inject(NotificationService);

  readonly moneda = INVENTARIO_CONFIG.MONEDA;

  filtrosFields = [...FILTROS_PRODUCTO_PUBLICO];
  filtros: ProductoFiltro = {};
  productos: Producto[] = [];
  cargando = true;
  page = 0;
  size = 12;
  totalRecords = 0;
  texto = 'Productos';
  categoriasMap = new Map<number, Categoria>();
  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProductos(this.page, this.size);
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategoriasPorTipo(CategoriaTipo.PRODUCTO).subscribe({
      next: (resp) => {
        const nodos = buildCategoryTree(resp.data?.content ?? []);
        this.filtrosFields = this.filtrosFields.map(filtro => filtro.key === 'idCategoria' ? { ...filtro, treeOptions: nodos } : filtro);
      },
      error: (error) => {
        this.notify.showHttpError(error.message);
      }
    });
  }

  cargarProductos(page: number, size: number): void {
    this.cargando = true;
    const filter = { ...this.filtros, page, size };
    this.productoService.obtenerProductosPublico(filter).subscribe({
      next: (resp) => {
        this.productos = resp.data.content;
        this.totalRecords = resp.data.totalElements ?? this.productos.length;
        this.cargando = false;
      }
      , error: (error) => {
        this.notify.showHttpError(error.message);
        this.productos = [];
        this.cargando = false;
      }
    });
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

  onPage(event: { page: number; size: number }) {
    this.page = event.page;
    this.size = event.size;
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

  onBuscar(valores: Partial<ProductoFiltro>): void {
    if (valores.idCategoria && typeof valores.idCategoria === 'object') {
      const nodo = valores.idCategoria as any;
      valores.idCategoria = nodo.key ?? nodo.data?.id ?? undefined;
    }
    this.filtros = { ...this.filtros, ...valores};
    this.page = 0;
    this.cargarProductos(0, this.size);
  }

  onLimpiar(): void {
    this.filtros = {};
    this.page = 0;
    this.cargarProductos(0, this.size);
  }
}

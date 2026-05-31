import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Producto } from '@/app/core/models/catalogos/productos.model';
import { ProductoCardComponent } from '../producto-card/producto-card.component';

@Component({
  standalone: true,
  selector: 'app-producto-lista',
  imports: [CommonModule, ProductoCardComponent],
  templateUrl: './producto-lista.html',
  styleUrls: ['./producto-lista.css'],
})
export class ProductoListaComponent {
  @Input() productos: Producto[] = [];
  @Output() verProducto = new EventEmitter<Producto>();

  trackById(_index: number, item: Producto) {
    return item.id;
  }

  verProductoDetalle(producto: Producto) {
    this.verProducto.emit(producto);
  }

  seleccionarProducto(producto: Producto): void {
    this.verProducto.emit(producto);
  }
}

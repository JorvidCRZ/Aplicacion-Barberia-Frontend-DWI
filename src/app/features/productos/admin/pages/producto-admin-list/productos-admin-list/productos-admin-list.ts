import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';

import { ProductoFacade } from '@/app/features/productos/facade/producto.facade';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ProductoResponse } from '@/app/features/productos/models/response/ProductoResponse';






@Component({
  selector: 'app-productos-admin-list',
 imports: [SelectModule, IconFieldModule, InputIconModule, MultiSelectModule, TableModule, TagModule, InputTextModule, FormsModule, CurrencyPipe, ButtonModule],
   
  templateUrl: './productos-admin-list.html',
  styleUrl: './productos-admin-list.css',
})
export class ProductosAdminList {

  private facade = inject(ProductoFacade);

  productos = this.facade.productos;
  loading = true;

  ngOnInit() {
    this.facade.cargarProductos();
    this.loading = false;
  }
  
   getSeverity(stock: number) {
    if (stock === 0) return 'danger';
    if (stock < 10) return 'warn';
    return 'success';
  }

   clear(table: Table) {
        table.clear();
    }

}
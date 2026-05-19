import { Component, inject, Input, OnInit, WritableSignal } from '@angular/core';
import { ProductoResponse } from '../../../../models/response/ProductoResponse';
import { ProductoCard } from '../../../../shared/components/producto-card/producto-card/producto-card';
import { map, Observable } from 'rxjs';
import { ProductoService } from '../../../../services/producto-service';
import { ProductoLista } from "../../../../shared/components/productoLista/producto-lista/producto-lista";
import { AsyncPipe } from '@angular/common';
import { ProductoStore } from '../../../../store/producto.store';
import { ProductoFacade } from '../../../../facade/producto.facade';

@Component({
  standalone: true,
  selector: 'app-producto-list',
  imports: [ ProductoLista],
  templateUrl: './producto-list.html',
  styleUrl: './producto-list.css',
})
export class ProductoList implements OnInit{

 
  
  
  private facade = inject(ProductoFacade);

  productos = this.facade.productos;

  ngOnInit() {
    this.facade.cargarProductos();
   

  }

  
  

  

}

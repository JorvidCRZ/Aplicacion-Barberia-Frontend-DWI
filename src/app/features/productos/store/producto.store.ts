
import { inject, Injectable, signal } from "@angular/core";
import { ProductoResponse } from "../models/response/ProductoResponse";
import { BehaviorSubject } from "rxjs";
import { ProductoService } from "../services/producto-service";

@Injectable({providedIn: 'root'})
export class ProductoStore {


  private _productos = signal<ProductoResponse[]>([]);

  productos = this._productos.asReadonly();

  setProductos(data: ProductoResponse[]) {
    this._productos.set(data);
  }

  

  agregarProducto(producto: ProductoResponse) {
    this._productos.update(list => [producto, ...list]);
  }

  limpiar() {
    this._productos.set([]);
  }
}    
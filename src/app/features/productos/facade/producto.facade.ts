import { effect, inject, Injectable, signal } from "@angular/core";
import { ProductoService } from "../services/producto-service";
import { ProductoStore } from "../store/producto.store";
import { tap } from "rxjs";

@Injectable({ providedIn: 'root' })

export class ProductoFacade {

     private api = inject(ProductoService);
      private store = inject(ProductoStore);

      productos = this.store.productos;


      cargarProductos(){
        this.api.getProductos().subscribe({
            next: (Response) =>{
                this.store.setProductos(Response.data.content);
            },
            error: (error) => {
                console.error('Error al cargar productos:', error);
            }
        })
      }

      crearProducto(producto: any){
        
      }
}

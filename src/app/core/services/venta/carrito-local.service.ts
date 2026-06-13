// import { Injectable } from '@angular/core';
// import { Producto } from '@/app/core/models/catalogos/productos.model';

// export interface CarritoItem {
//   producto: Producto;
//   cantidad: number;
// }

// @Injectable({ providedIn: 'root' })
// export class CarritoLocalService {
//   private readonly storageKey = 'fadex-carrito';

//   obtenerItems(): CarritoItem[] {
//     if (typeof window === 'undefined') {
//       return [];
//     }

//     try {
//       const rawItems = localStorage.getItem(this.storageKey);
//       return rawItems ? JSON.parse(rawItems) as CarritoItem[] : [];
//     } catch {
//       return [];
//     }
//   }

//   agregarProducto(producto: Producto, cantidad = 1): CarritoItem[] {
//     const items = this.obtenerItems();
//     const cantidadNormalizada = Math.max(1, Math.floor(cantidad));
//     const index = items.findIndex(item => item.producto.id === producto.id);

//     if (index >= 0) {
//       items[index] = {
//         ...items[index],
//         cantidad: items[index].cantidad + cantidadNormalizada,
//       };
//     } else {
//       items.push({ producto, cantidad: cantidadNormalizada });
//     }

//     this.guardar(items);
//     return items;
//   }

//   limpiar(): void {
//     if (typeof window === 'undefined') {
//       return;
//     }

//     localStorage.removeItem(this.storageKey);
//   }

//   private guardar(items: CarritoItem[]): void {
//     if (typeof window === 'undefined') {
//       return;
//     }

//     localStorage.setItem(this.storageKey, JSON.stringify(items));
//   }
// }
import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../../models/catalogos/productos.model';
import { CarritoItem } from '../../models/catalogos/carrito.model';

@Injectable({ providedIn: 'root' })
export class CarritoService {

    private _items = signal<CarritoItem[]>([]);
    readonly items = this._items.asReadonly();
    readonly cantidad = computed(() => this._items().reduce((sum, item) => sum + item.cantidad, 0));
    readonly subtotal = computed(() => this._items().reduce((sum, item) => sum + item.cantidad * item.producto.precio, 0));
    readonly total = computed(() => this.subtotal());

    constructor() {
        this.cargarCarritoDelStorage();
    }

    // =========================
    // STORAGE
    // =========================

    private cargarCarritoDelStorage(): void {
        try {
            const saved = localStorage.getItem('carrito');
            if (!saved) return;
            const items: CarritoItem[] = JSON.parse(saved);
            this._items.set(items);
        } catch (e) { console.warn('No se pudo cargar el carrito:', e); }
    }

    private guardarCarritoEnStorage(): void {
        localStorage.setItem('carrito', JSON.stringify(this._items()));
    }

    // =========================
    // OPERACIONES
    // =========================

    agregarProducto(producto: Producto, cantidad: number = 1): void {
        if (cantidad <= 0) return;

        const items = [...this._items()];
        const index = items.findIndex(i => i.producto.id === producto.id);

        if (index !== -1) {
            items[index] = {
                ...items[index],
                cantidad: items[index].cantidad + cantidad
            };
        } else {
            items.push({
                producto,
                cantidad,
                subtotal: producto.precio * cantidad,
                total: producto.precio * cantidad,
            });
        }

        this._items.set(items);
        this.guardarCarritoEnStorage();
    }

    actualizarCantidad(index: number, cantidad: number): void {
        if (cantidad <= 0) {
            this.eliminarProducto(index);
            return;
        }

        const items = [...this._items()];

        if (items[index]) {
            items[index] = {
                ...items[index],
                cantidad
            };

            this._items.set(items);
            this.guardarCarritoEnStorage();
        }
    }

    eliminarProducto(index: number): void {
        const items = [...this._items()];
        items.splice(index, 1);

        this._items.set(items);
        this.guardarCarritoEnStorage();
    }

    vaciarCarrito(): void {
        this._items.set([]);
        localStorage.removeItem('carrito');
    }

    obtenerCarrito(): CarritoItem[] {
        return this._items();
    }
}
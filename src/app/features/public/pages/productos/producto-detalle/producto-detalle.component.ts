import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { Producto } from '@/app/core/models/catalogos/productos.model';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { INVENTARIO_CONFIG } from '@/app/core/config/valores.config';
import { CarritoLocalService } from '@/app/core/services/venta/carrito-local.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { ImageModule } from 'primeng/image';

@Component({
    standalone: true,
    selector: 'app-producto-detalle',
    imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, SafeImageUrlPipe, StatusBadgeComponent, ImageModule],
    templateUrl: './producto-detalle.html',
    styleUrl: './producto-detalle.css',
})
export class ProductoDetalleComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly productoService = inject(ProductoService);
    private readonly carritoService = inject(CarritoLocalService);
    private readonly notificationService = inject(NotificationService);

    readonly moneda = INVENTARIO_CONFIG.MONEDA;

    cargando = true;
    producto: Producto | null = null;
    cantidad = 1;
    imagenSeleccionada = '/assets/producto.webp';
    images: any[] = [];

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));

        if (!id) {
            this.regresar();
            return;
        }

        this.cargarProducto(id);
    }

    cargarProducto(id: number): void {
        this.cargando = true;

        this.productoService.obtenerProductosPublicoId(id).subscribe({
            next: (resp) => {
                this.producto = resp.data ?? null;
                this.cargando = false;

                if (!this.producto) {
                    this.regresar();
                    return;
                }

                this.imagenSeleccionada = this.obtenerImagenPrincipal(this.producto);
                this.images = (this.producto.urlsMultimedia ?? []).map((u: string) => ({ itemImageSrc: u, thumbnailImageSrc: u }));
                this.cantidad = 1;
            },
            error: () => {
                this.cargando = false;
                this.regresar();
            },
        });
    }

    obtenerImagenPrincipal(producto: Producto): string {
        return producto.urlsMultimedia?.length ? producto.urlsMultimedia[0] : '/assets/producto.webp';
    }

    seleccionarImagen(url: string): void {
        this.imagenSeleccionada = url;
    }

    get cantidadMaxima(): number {
        return this.producto?.stock ?? 1;
    }

    get subtotal(): number {
        return (this.producto?.precio ?? 0) * Math.max(1, this.cantidad || 1);
    }

    agregarAlCarrito(): void {
        if (!this.producto) {
            return;
        }

        const cantidadNormalizada = Math.min(Math.max(1, Math.floor(this.cantidad || 1)), Math.max(1, this.producto.stock));
        this.carritoService.agregarProducto(this.producto, cantidadNormalizada);
        this.notificationService.showSuccess(`${this.producto.nombre} agregado al carrito`);
    }

    regresar(): void {
        this.router.navigate(['/productos']);
    }

    irCarrito(): void {
        this.router.navigate(['/carrito']);
    }
}
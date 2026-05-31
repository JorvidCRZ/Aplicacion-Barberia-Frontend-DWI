import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '@/app/core/models/catalogos/productos.model';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { CarritoLocalService } from '@/app/core/services/venta/carrito-local.service';
import { NotificationService } from '@/app/core/services/common/notification.service';

@Component({
  standalone: true,
  selector: 'app-producto-card',
  imports: [ButtonModule, CardModule, CurrencyPipe, SafeImageUrlPipe, StatusBadgeComponent],
  templateUrl: './producto-card.html',
  styleUrls: ['./producto-card.css'],
})
export class ProductoCardComponent {
  private readonly router = inject(Router);
  private readonly carritoService = inject(CarritoLocalService);
  private readonly notificationService = inject(NotificationService);

  @Input() producto!: Producto;

  onVer(): void {
    if (this.producto) {this.router.navigate(['/productos/detalle', this.producto.id]);}
  }

  getImagenProducto(producto: Producto): string {
    return producto.urlsMultimedia?.length ? producto.urlsMultimedia[0] : '/assets/producto.webp';
  }
  
  agregarAlCarrito(): void {
    if (!this.producto) {return;}
    this.carritoService.agregarProducto(this.producto, 1);
    this.notificationService.showSuccess(`${this.producto.nombre} agregado al carrito`);
  }
}

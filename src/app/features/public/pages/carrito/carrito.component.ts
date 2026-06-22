import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { TokenService } from '@/app/core/services/auth/token.service';
import { NotificationService } from '@/app/core/services/common/notification.service';
import { CarritoService } from '@/app/core/services/catalogos/carrito.service';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [ CommonModule, FormsModule, TableModule, ButtonModule, InputNumberModule, SafeImageUrlPipe, SolesPipe
  ],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent {

  private router = inject(Router);
  private notify = inject(NotificationService);
  private tokenService = inject(TokenService);
  private carritoService = inject(CarritoService);

  readonly items = this.carritoService.items;
  readonly subtotal = this.carritoService.subtotal;
  readonly total = this.carritoService.total;
  readonly cantidad = this.carritoService.cantidad;

  procesarCompra(): void {
    if (!this.tokenService.isLogged()) {
      this.notify.showError('Debes iniciar sesión para continuar con la compra');
      this.router.navigate(['/productos']);
      return;
    }
    this.router.navigate(['/checkout']);
  }

  actualizarCantidad(index: number, cantidad: number): void {
    this.carritoService.actualizarCantidad(index, cantidad);
  }

  eliminarProducto(index: number): void {
    this.carritoService.eliminarProducto(index);
    this.notify.showSuccess('Producto eliminado del carrito');
  }

  vaciarCarrito(): void {
    this.carritoService.vaciarCarrito();
    this.notify.showSuccess('Carrito vaciado');
  }

  continuarCompra(): void {
    this.router.navigate(['/productos']);
  }
}
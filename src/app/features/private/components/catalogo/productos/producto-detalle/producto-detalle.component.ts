import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { ProductoService } from '@/app/core/services/catalogos/producto.service';
import { environment } from '@/environments/environment.development';
import { Producto } from '@/app/core/models/catalogos/productos.model';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { INVENTARIO_CONFIG } from '@/app/core/config/valores.config';

@Component({
  selector: 'app-producto-detalle',
  imports: [ButtonModule, ImageModule, CommonModule, StatusBadgeComponent, SafeImageUrlPipe],
  templateUrl: './producto-detalle.html',
  styleUrl: './producto-detalle.css',
})
export class ProductoDetalleComponent implements OnInit {

  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);

  environment = environment.apiUrl;
  readonly moneda = INVENTARIO_CONFIG.MONEDA;
  readonly stockMinimo = INVENTARIO_CONFIG.STOCK_MINIMO_GLOBAL;
  detalleProducto?: Producto;
  cargando = true;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.obtenerDetalleProducto(id);
  }

  volver() {
    this.router.navigate(['/dashboard/catalogo/productos']);
  }

  private obtenerDetalleProducto(id: number) {
    this.productoService.obtenerProductoId(id).subscribe({
      next: (resp) => {
        this.detalleProducto = resp.data;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }
}


import { ReclamoResponse } from '@/app/core/models/operaciones/reclamos-model/reclamo.model';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { formatearTexto } from '@/app/shared/utils/formatear-text.utils.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { environment } from '@/environments/environment.development';
import { GalleriaModule } from 'primeng/galleria';
import { DialogModule } from 'primeng/dialog';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';

@Component({
  selector: 'app-reclamo-table',
  imports: [CommonModule, TableModule, ButtonModule, StatusBadgeComponent, ConfirmPopoverComponent, GalleriaModule, ConfirmPopoverComponent,
    DialogModule, SolesPipe
  ],
  templateUrl: './reclamo-table.html',
  styleUrl: './reclamo-table.css',
})
export class ReclamoTableComponent {
  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() actualizar = new EventEmitter<ReclamoResponse>();
  @Output() eliminar = new EventEmitter<ReclamoResponse>();
  @Output() ver = new EventEmitter<number>();
  @Input({ required: true }) reclamos: ReclamoResponse[] = [];
  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 25;
  @Input() icono = 'pi-trash';

  environment = environment.apiUrl;

  formatearTexto = formatearTexto;
  mostrarConfirmacion = false;
  reclamoAEliminar: ReclamoResponse | null = null;

  numVisible = 5;
  activeIndex = 0;
  mostrarGaleria = false;
  imagenesGaleria: { itemImageSrc: string; thumbnailImageSrc: string; alt: string }[] = [];

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  pedirConfirmacion(reclamo: ReclamoResponse, event: MouseEvent): void {
    event.stopPropagation();
    this.reclamoAEliminar = reclamo;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar(): void {
    if (!this.reclamoAEliminar) return;
    this.eliminar.emit(this.reclamoAEliminar);
    this.cancelarEliminar();
  }

  actualizarReclamo(reclamo: ReclamoResponse): void {
    this.actualizar.emit(reclamo);
  }

  cancelarEliminar(): void {
    this.mostrarConfirmacion = false;
    this.reclamoAEliminar = null;
  }

  get mensajeConfirmacion(): string {
    return this.reclamoAEliminar ? `¿Seguro que deseas eliminar el reclamo N° "${this.reclamoAEliminar.numeroReclamo}"?` : '';
  }

  verReclamo(reclamo: ReclamoResponse): void {
    this.ver.emit(reclamo.idReclamo);
  }

  get mensajeEliminar(): string {
    return this.reclamoAEliminar ? `¿Seguro que deseas eliminar el reclamo <br><b>"${this.reclamoAEliminar.numeroReclamo}"</b>?` : '';
  }


  // abrirGaleria(reclamo: ReclamoResponse, index = 0): void {
  //   const imagenes = reclamo.adjuntos?.filter(a => a.tipoAdjunto?.startsWith('image')) ?? [];
  //   if (!imagenes.length) return;
  //   this.imagenesGaleria = imagenes.map((a, i) => ({
  //     itemImageSrc: `${this.environment}/uploads/${a.urlArchivo}`,
  //     thumbnailImageSrc: `${this.environment}/uploads/${a.urlArchivo}`,
  //     alt: `${reclamo.numeroReclamo} adjunto ${i + 1}`,
  //   }));
  //   this.activeIndex = Math.min(index, this.imagenesGaleria.length - 1);
  //   this.numVisible = Math.min(this.imagenesGaleria.length, 5);
  //   this.mostrarGaleria = true;
  // }

  // tieneImagenes(reclamo: ReclamoResponse): boolean {
  //   return (reclamo.adjuntos ?? []).some(a => a.tipoAdjunto?.startsWith('image'));
  // }

  // totalAdjuntos(reclamo: ReclamoResponse): number {
  //   return reclamo.adjuntos?.length ?? 0;
  // }
}

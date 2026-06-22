import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableLazyLoadEvent } from 'primeng/table';
import { Servicio } from '@/app/core/models/catalogos/servicios.model';
import { environment } from '@/environments/environment.development';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { SafeImageUrlPipe } from '@/app/shared/pipes/safe-image-url.pipe';
import { SolesPipe } from '@/app/shared/pipes/moneda.pipe';

@Component({
  selector: 'app-servicio-table',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, GalleriaModule, ImageModule, ToggleSwitchModule,
    InputIconModule, IconFieldModule, ConfirmPopoverComponent, StatusBadgeComponent, SafeImageUrlPipe, SolesPipe
  ],
  templateUrl: './servicio-table.html',
  styleUrl: './servicio-table.css',
})
export class ServicioTableComponent {
  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() publicado = new EventEmitter<{ id: number, publicado: boolean }>();
  @Output() estado = new EventEmitter<{ id: number, activo: boolean }>();
  @Output() ver = new EventEmitter<number>();
  @Output() editar = new EventEmitter<Servicio>();
  @Output() eliminar = new EventEmitter<Servicio>();
  @Input({ required: true }) servicios: Servicio[] = [];
  @Input() icono: string = 'pi-briefcase';
  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 25;

  environment = environment.apiBaseUrl;

  mostrarConfirmacion = false;
  servicioAEliminar: Servicio | null = null;

  mostrarGaleria = false;
  imagenesGaleria: any[] = [];
  activeIndex = 0;
  numVisible = 5;

  verServicio(servicio: Servicio) {
    this.ver.emit(servicio.servicioId);
  }

  editarServicio(servicio: Servicio) {
    this.editar.emit(servicio);
  }

  cambiarEstadoServicio(servicio: Servicio, event: { checked: boolean }) {
    this.estado.emit({ id: servicio.servicioId, activo: event.checked });
  }

  cambiarPublicadoServicio(servicio: Servicio, event: { checked: boolean }) {
    this.publicado.emit({ id: servicio.servicioId, publicado: event.checked });
  }

  pedirConfirmacion(servicio: Servicio, event: MouseEvent) {
    event.stopPropagation();
    this.servicioAEliminar = servicio;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (!this.servicioAEliminar) return;
    this.eliminar.emit(this.servicioAEliminar);
    this.cancelarEliminar();
  }

  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.servicioAEliminar = null;
  }

  get mensajeConfirmacion(): string {
    return this.servicioAEliminar ? `¿Seguro que deseas eliminar el servicio "${this.servicioAEliminar.nombre}"?` : '';
  }

  abrirGaleria(servicio: Servicio, index: number = 0) {
    if (!servicio.urlsMultimedia?.length) return;

    this.imagenesGaleria = servicio.urlsMultimedia.map((url, i) => ({
      itemImageSrc: `${this.environment}uploads/${url}`,
      thumbnailImageSrc: `${this.environment}uploads/${url}`,
      alt: servicio.nombre + ' ' + i
    }));

    this.activeIndex = index;
    this.numVisible = Math.min(this.imagenesGaleria.length, 5);
    this.mostrarGaleria = true;
  }

  responsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];
}
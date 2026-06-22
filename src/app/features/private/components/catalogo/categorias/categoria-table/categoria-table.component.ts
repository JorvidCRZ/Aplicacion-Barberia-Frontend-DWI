import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageModule } from 'primeng/image';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ConfirmPopoverComponent } from '@/app/shared/components/confirm-popover/confirm-popover.component';
import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component';
import { CategoriaTreeComponent } from '../categoria-tree/categoria-tree.component';
import { Categoria } from '@/app/core/models/catalogos/categorias.model';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-categoria-table',
  standalone: true,
  imports: [
    ButtonModule, CommonModule, TableModule, ConfirmPopoverComponent, ToggleSwitchModule, FormsModule,TooltipModule,
    CategoriaTreeComponent, ImageModule, IconFieldModule, InputIconModule, StatusBadgeComponent,
  ],
  templateUrl: './categoria-table.html'
})
export class CategoriaTableComponent {
  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() editar = new EventEmitter<Categoria>();
  @Output() eliminar = new EventEmitter<Categoria>();
  @Output() estado = new EventEmitter<{ id: number, activo: boolean }>();
  @Input({ required: true }) categorias: Categoria[] = [];
  @Input() icono: string = 'pi-trash';
  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 25;

  mostrarConfirmacion = false;
  categoriaAEliminar: Categoria | null = null;

  actualizarCategoria(categoria: Categoria) {
    this.editar.emit(categoria);
  }

  pedirConfirmacion(categoria: Categoria, event: MouseEvent) {
    event.stopPropagation();
    this.categoriaAEliminar = categoria;
    this.mostrarConfirmacion = true;
  }

  cambiarEstado(categoria: Categoria, event: { checked: boolean }) {
    this.estado.emit({ id: categoria.id, activo: event.checked })
  }

  handleTreeEstado(event: { id: number, activo: boolean }) {
    this.estado.emit(event);
  }

  eliminarDesdeTree(categoria: Categoria) {
    this.categoriaAEliminar = categoria;
    this.mostrarConfirmacion = true;
  }

  confirmarEliminar() {
    if (!this.categoriaAEliminar) return;
    this.eliminar.emit(this.categoriaAEliminar);
    this.cancelarEliminar();
  }

  cancelarEliminar() {
    this.mostrarConfirmacion = false;
    this.categoriaAEliminar = null;
  }

  get mensajeConfirmacion(): string {
    return this.categoriaAEliminar ? `¿Seguro que deseas eliminar la categoría "${this.categoriaAEliminar.nombre}"?` : '';
  }
}
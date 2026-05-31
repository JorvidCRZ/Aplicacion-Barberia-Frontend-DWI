import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { Venta } from '@/app/core/models/ventas/venta.model';
//import { StatusBadgeComponent } from '@/app/shared/components/status-badge/status-badge.component'; 

@Component({
  selector: 'app-venta-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    //StatusBadgeComponent 
  ],
  templateUrl: './venta-table.html',
  styleUrls: ['./venta-table.css'],
  encapsulation: ViewEncapsulation.None
})
export class VentaTableComponent {

  @Input() ventas: Venta[] = [];
  @Input() cargado = false;
  @Input() totalRecords = 0;
  @Input() rows = 25;

  @Output() lazyLoad = new EventEmitter<TableLazyLoadEvent>();
  @Output() editar   = new EventEmitter<Venta>();
  @Output() eliminar = new EventEmitter<Venta>();

  calcularTotal(venta: Venta): number {
    return (venta.detalles ?? []).reduce((acc, det) => {
      return acc + (Number(det.precioUnitario) * Number(det.cantidad));
    }, 0);
  }
}
import { Component, Input, Output, EventEmitter, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentaBarbero, ResumenBarbero } from '@core/models/planilla/venta-barbero.model';

@Component({
  selector: 'app-barbero-ventas-tabla',
  imports: [CommonModule, FormsModule],
  templateUrl: './barbero-ventas-tabla.html',
  styleUrl: './barbero-ventas-tabla.css',
})
export class BarberoVentasTabla implements OnChanges, OnInit {
  @Input() ventas: VentaBarbero[] = [];
  @Input() resumen: ResumenBarbero | null = null;

  private _page: number = 0;
  private _size: number = 20;
  private _totalElements: number = 0;
  private _totalPages: number = 0;

  @Input() set page(val: number)          { this._page          = Number(val) || 0; }
  @Input() set size(val: number)          { this._size          = Number(val) || 20; }
  @Input() set totalElements(val: number) { this._totalElements = Number(val) || 0; }
  @Input() set totalPages(val: number)    { this._totalPages    = Number(val) || 0; }

  get page():          number { return this._page; }
  get size():          number { return this._size; }
  get totalElements(): number { return this._totalElements; }
  get totalPages():    number { return this._totalPages; }

  @Output() paginaCambiada = new EventEmitter<number>();
  @Output() filtroAplicado = new EventEmitter<{ mes: number; anio: number }>();

  readonly Math = Math;

  mesFiltro: number  = new Date().getMonth() + 1;
  anioFiltro: number = new Date().getFullYear();

  meses = [
    { id: 1,  nombre: 'Enero' },
    { id: 2,  nombre: 'Febrero' },
    { id: 3,  nombre: 'Marzo' },
    { id: 4,  nombre: 'Abril' },
    { id: 5,  nombre: 'Mayo' },
    { id: 6,  nombre: 'Junio' },
    { id: 7,  nombre: 'Julio' },
    { id: 8,  nombre: 'Agosto' },
    { id: 9,  nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ];

  aniosDisponibles: number[] = [];

  ngOnInit(): void {
    const anioActual = new Date().getFullYear();
    this.aniosDisponibles = [anioActual - 1, anioActual];
  }

  ngOnChanges(changes: SimpleChanges): void {}

  aplicarFiltro(): void {
    this.filtroAplicado.emit({ mes: this.mesFiltro, anio: this.anioFiltro });
  }

  get paginaActual(): number { return this._page + 1; }

  get desde(): number {
    return this._totalElements === 0 ? 0 : this._page * this._size + 1;
  }

  get hasta(): number {
    return Math.min((this._page + 1) * this._size, this._totalElements);
  }
}
import { Component, Input, Signal, WritableSignal } from '@angular/core';
import { ProductoCard } from '../../producto-card/producto-card/producto-card';
import { ProductoResponse } from '../../../../models/response/ProductoResponse';

@Component({
  standalone: true,
  selector: 'app-producto-lista',
  imports: [ProductoCard],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css',
})
export class ProductoLista {
  @Input() productos!: ProductoResponse[] ;

}

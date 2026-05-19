import { Component, Input } from '@angular/core';
import { ProductoResponse } from '../../../../models/response/ProductoResponse';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-producto-card',
  imports: [ButtonModule, CardModule,RouterLink, CurrencyPipe],
  templateUrl: './producto-card.html',
  styleUrl: './producto-card.css',
})
export class ProductoCard {

  @Input() producto!: ProductoResponse ;

}

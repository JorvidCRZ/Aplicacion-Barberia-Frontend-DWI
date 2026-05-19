import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Buscar...';
  @Output() search = new EventEmitter<string>();
  valor: string = '';
  onSearch() { this.search.emit(this.valor); }
  clearSearch() { this.valor = '';this.search.emit('');}
}

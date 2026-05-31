import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBarComponent implements OnChanges {
  @Input() placeholder: string = 'Buscar...';
  @Input() value: string = '';
  @Output() search = new EventEmitter<string>();
  valor: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.valor = this.value ?? '';
    }
  }

  onSearch() { this.search.emit(this.valor); }
  clearSearch() { this.valor = '';this.search.emit('');}
}

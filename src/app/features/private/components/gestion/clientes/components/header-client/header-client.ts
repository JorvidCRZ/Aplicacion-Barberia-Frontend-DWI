import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header-client',
  imports: [SearchBarComponent, ButtonModule],
  templateUrl: './header-client.html',
  styleUrl: './header-client.css',
})
export class HeaderClient {
  @Input() title: string = 'Clientes';
  @Input() icon: string = 'pi-users';
  @Input() description: string = 'Gestión y administración de clientes';
  @Input() buttonLabel: string = 'Nuevo';
  @Input() searchValue: string = '';
  @Output() create = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  onCreate() { this.create.emit(); }
  onSearch(q: string) { this.search.emit(q); }
}

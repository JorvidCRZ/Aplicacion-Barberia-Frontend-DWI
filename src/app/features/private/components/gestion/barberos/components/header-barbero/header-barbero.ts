import { SearchBarComponent } from '@/app/shared/components/search-bar/search-bar.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-header-barbero',
  imports: [SearchBarComponent, ButtonModule, RouterLink],
  templateUrl: './header-barbero.html',
  styleUrl: './header-barbero.css',
})
export class HeaderBarbero {
  @Input() title: string = 'Barberos';
  @Input() icon: string = 'pi-users';
  @Input() description: string = 'Gestión y administración de Barberos';
  @Input() buttonLabel: string = 'Nuevo';
  @Output() create = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  onCreate() { this.create.emit(); }
  onSearch(q: string) { this.search.emit(q); }
}

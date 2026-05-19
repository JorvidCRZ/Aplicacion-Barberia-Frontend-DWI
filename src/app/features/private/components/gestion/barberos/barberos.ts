import { Component } from '@angular/core';
import { HeaderBarbero } from "./components/header-barbero/header-barbero";
import { ResumenGeneralBarbero } from './components/resumen-general-barbero/resumen-general-barbero';

@Component({
  selector: 'app-barberos',
  imports: [HeaderBarbero, ResumenGeneralBarbero],
  templateUrl: './barberos.html',
  styleUrl: './barberos.css',
})
export class Barberos {
icono: string = 'pi-users';

  searchTerm: string = '';

  abrirCrear(): void {
    // TODO: conectar con el formulario/diálogo de creación de barbero
    return;
  }

  onSearch(query: string): void {
    this.searchTerm = query;
    // Puedes usar searchTerm para filtrar la lista de barberos
  }

}

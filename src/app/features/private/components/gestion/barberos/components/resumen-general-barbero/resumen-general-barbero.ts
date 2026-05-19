import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resumen-general-barbero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-general-barbero.html',
  styleUrl: './resumen-general-barbero.css',
})
export class ResumenGeneralBarbero implements OnInit {
  resumen: any[] = [];

  ngOnInit(): void {
    // Valores ejemplo — sustituir por llamada a API cuando exista servicio
    this.resumen = [
      { valor: 6, titulo: 'Total barberos', delta: null, positivo: true, icono: 'pi-users' },
      { valor: 3, titulo: 'Disponibles', delta: null, positivo: true, icono: 'pi-check-circle' },
      { valor: 2, titulo: 'Ocupados', delta: null, positivo: false, icono: 'pi-clock' },
      { valor: 'S/1,840', titulo: 'Ventas hoy', delta: '+12% vs ayer', positivo: true, icono: 'pi-dollar' },
      { valor: 'Diego M.', titulo: 'Mejor del mes', delta: 'S/5,200 generados', positivo: true, icono: 'pi-star' }
    ];
  }

}

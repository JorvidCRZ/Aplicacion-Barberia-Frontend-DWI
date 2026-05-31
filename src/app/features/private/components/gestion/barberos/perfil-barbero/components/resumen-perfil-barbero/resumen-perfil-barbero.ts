import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';

@Component({
  selector: 'app-resumen-perfil-barbero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-perfil-barbero.html',
  styleUrl: './resumen-perfil-barbero.css',
})
export class ResumenPerfilBarbero implements OnInit {

  @Input({ required: true }) barberoId!: number;

  private barberoService = inject(BarberoService);

  barberoNombre    = '';
  cortesMesActual  = 0;
  ingresosGenerados = 'S/0';
  comisionGanada   = 'S/0';
  reservasHoy      = 0;
  cargando         = true;

  ngOnInit(): void {
    this.barberoService.obtenerResumenIndividual(this.barberoId).subscribe({
      next: (res) => {
        if (!res?.success || !res.data) return;
        const d = res.data;
        this.barberoNombre    = d.nombreBarbero;
        this.cortesMesActual  = d.cortesEsteMes;
        this.ingresosGenerados = `S/${d.ingresosGenerados.toFixed(2)}`;
        this.comisionGanada   = `S/${d.comisionGanada.toFixed(2)}`;
        this.reservasHoy      = d.reservasHoy;
        this.cargando         = false;
      },
      error: () => { this.cargando = false; }
    });
  }
}
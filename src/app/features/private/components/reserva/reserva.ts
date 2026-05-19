import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Reservas } from '@/app/core/services/reserva/reserva';
import { CitaBarberoResponseDTO, EstadoCita } from '@/app/core/models/reserva/reserva.model';

@Component({
  selector: 'app-reserva',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ButtonModule,
    TableModule,
  ],
  templateUrl: './reserva.html',
  styleUrl: './reserva.css',
})
export class ReservaComponent implements OnInit {

  private readonly reservasService = inject(Reservas);

  citas: CitaBarberoResponseDTO[] = [];
  cargando = false;
  accionEnCurso: number | null = null;

  ngOnInit(): void {
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.cargando = true;
    this.reservasService.getCitasHoy().subscribe({
      next: (data) => {
        this.citas = data;
        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  onCambiarEstado(cita: CitaBarberoResponseDTO, nuevoEstado: EstadoCita): void {
    this.accionEnCurso = cita.idReserva;
    this.reservasService.cambiarEstado(cita.idReserva, nuevoEstado).subscribe({
      next: () => {
        cita.estado = nuevoEstado;
        this.accionEnCurso = null;
      },
      error: () => {
        this.accionEnCurso = null;
      }
    });
  }

}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BarberoService } from '@/app/core/services/gestion/barbero.service';
import { Cita, DiaResumen } from '@/app/core/models/gestion/barbero/barbero-resumen-individual.model';

@Component({
  selector: 'app-resumen-barbero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resumen-barbero.html',
  styleUrl: './resumen-barbero.css',
})
export class ResumenBarbero implements OnInit {

  private svc    = inject(BarberoService);
  private router = inject(Router);

  nombre     = '';
  avatarUrl  = '';
  barberoId  = 0;
  isOcupado  = false;

  cortesHoy   = 0;
  metaCortes  = 12;
  ingresosHoy = 0;
  comisionHoy = 0;
  clientesHoy = 0;

  citas: Cita[]      = [];
  citasLoading       = true;

  dias: any[]        = [];
  sueldoBase         = 0;
  comisionSemanal    = 0;
  totalSemana        = 0;
  maxCortes          = 1;
  semanalLoading     = true;

  ngOnInit(): void {
  this.svc.getPerfil().subscribe({
    next: ({ data: perfil }) => {
      this.nombre       = `${perfil.nombre} ${perfil.apellido}`;
      this.avatarUrl    = perfil.fotoUrl ?? '';
      this.barberoId    = perfil.barberoId;
      this.isOcupado    = perfil.ocupado;
      this.sueldoBase   = perfil.sueldo ?? 0;
      const pctComision = (perfil.comision ?? 0) / 100;

      forkJoin([
        this.svc.getStatsHoy(this.barberoId),
        this.svc.getCitasHoy(),
        this.svc.getResumenSemanal(this.barberoId),
      ]).subscribe({
        next: ([statsRes, citasRes, semanalRes]) => {
          const stats   = statsRes.data;
          const semanal = semanalRes.data;

          this.cortesHoy   = stats.completados ?? 0;
          this.metaCortes  = stats.totalDia ?? 12;
          this.ingresosHoy = stats.reservas?.reduce((sum: number, r: any) => sum + (r.total ?? 0), 0) ?? 0;
          this.comisionHoy = Math.round(this.ingresosHoy * pctComision * 100) / 100;
          this.clientesHoy = stats.completados ?? 0;

          this.citas        = Array.isArray(citasRes) ? citasRes : (citasRes as any)?.data ?? [];
          this.citasLoading = false;

          this.dias            = semanal.dias ?? [];
          this.maxCortes       = Math.max(...this.dias.map((d: any) => d.atendidos ?? 0), 1);
          this.comisionSemanal = semanal.comisionSemanal ?? 0;
          this.totalSemana     = semanal.totalSemana ?? 0;
          this.sueldoBase      = semanal.sueldoBase ?? 0;
          this.semanalLoading  = false;
        },
        error: () => {
          this.citasLoading   = false;
          this.semanalLoading = false;
        }
      });
    },
    error: () => {
      this.nombre = 'Barbero';
    }
  });
}

  get primerNombre(): string {
    return this.nombre.split(' ')[0];
  }

  get estadoLabel(): string {
    return this.isOcupado ? 'Estado: Ocupado' : 'Estado: Disponible';
  }

  toggleEstado(): void {
    this.svc.toggleOcupado(this.barberoId).subscribe({
      next: ({ data }) => {
        this.isOcupado = data.estado === 'ocupado' || data.status === 'ocupado';
      },
      error: () => {
        this.isOcupado = !this.isOcupado;
      }
    });
  }

  cerrarSesion(): void {
    this.svc.logout().subscribe({
      complete: () => this.router.navigate(['/login']),
      error:    () => this.router.navigate(['/login']),
    });
  }

  getHora(c: Cita): string {
    return c.horaInicio ?? c.hora ?? c.hora_inicio ?? '';
  }

  getNombreCliente(c: Cita): string {
    return `${c.nombreCliente} ${c.apellidoCliente}`;
  }

  getNombreServicio(c: Cita): string {
    return c.servicios?.map((s: any) => s.nombreCorte).join(', ') ?? '';
  }

  getPrecio(c: Cita): number {
    return c.servicios?.reduce((sum: number, s: any) => sum + s.precio, 0) ?? 0;
  }

  getDiaLabel(d: any): string {
    const fecha = d.fecha ?? '';
    const date  = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-PE', { weekday: 'short' });
  }

  getCortesDia(d: any): number {
    return d.atendidos ?? 0;
  }

getIngresosDia(d: any): number {
  return d.totalIngresos ?? 0;
}

  getPorcentajeBarra(d: any): number {
    return Math.round((this.getCortesDia(d) / this.maxCortes) * 100);
  }
}
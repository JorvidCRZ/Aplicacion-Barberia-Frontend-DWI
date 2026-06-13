import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
import { environment } from '@/environments/environment.development';
import {
  ApiResponse,
  ClienteResumenResponseDTO,
  ResumenBarberoDTO,
  VentaResponseDTO,
  CitaBarberoResponseDTO,
  ReservaDTO,
  DashboardData,
  KpiCard,
} from '../../models/gestion/admin/resumen-admin';

@Injectable({
  providedIn: 'root',
})
export class ResumenadminService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  // ── Llamadas individuales ─────────────────────────────────────────────────

  getClientesResumen(): Observable<ClienteResumenResponseDTO> {
    return this.http
      .get<ApiResponse<ClienteResumenResponseDTO>>(`${this.apiUrl}/clientes/resumen`)
      .pipe(map(r => r.data));
  }

  getBarberosResumen(): Observable<ResumenBarberoDTO> {
    return this.http
      .get<ApiResponse<ResumenBarberoDTO>>(`${this.apiUrl}/barberos/resumen-general`)
      .pipe(map(r => r.data));
  }

  getVentas(): Observable<VentaResponseDTO[]> {
    return this.http
      .get<ApiResponse<VentaResponseDTO[]>>(`${this.apiUrl}/ventas`)
      .pipe(map(r => r.data));
  }

getCitasHoy(): Observable<CitaBarberoResponseDTO[]> {
  return this.http.get<CitaBarberoResponseDTO[]>(
    `${this.apiUrl}/barbero/citas/hoy`
  );
}

  getReservasBarbero(barberoId: number): Observable<ReservaDTO[]> {
    return this.http
      .get<ApiResponse<ReservaDTO[]>>(
        `${this.apiUrl}/barbero/reservas/barbero/${barberoId}/hoy`
      )
      .pipe(map(r => r.data));
  }

  // ── Llamada consolidada (todas en paralelo) ───────────────────────────────

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      clientes: this.getClientesResumen(),
      barberos: this.getBarberosResumen(),
      ventas:   this.getVentas(),
      citas:    this.getCitasHoy(),
    });
  }

  // ── Helpers de cálculo ────────────────────────────────────────────────────

calcularIngresosCortes(citas: CitaBarberoResponseDTO[] = []): number {
  return citas.reduce((total, cita) => {
    const sumaServicios = (cita.servicios ?? []).reduce(
      (sum, s) => sum + (s.precio ?? 0),
      0
    );

    return total + sumaServicios;
  }, 0);
}

calcularCortesRealizados(citas: CitaBarberoResponseDTO[] = []): number {
  return citas.length;
}

  calcularCitasCompletadas(citas: CitaBarberoResponseDTO[] = []): number {
  return citas.filter(c => c.estado === 'COMPLETADA').length;
}

  // ── Construir las 8 KPI cards ─────────────────────────────────────────────

  buildKpiCards(data: DashboardData): KpiCard[] {
const ingresos = this.calcularIngresosCortes(data.citas || []);
const cortes   = this.calcularCortesRealizados(data.citas || []);
    const citasComp = this.calcularCitasCompletadas(data.citas || []);
    const pos       = (delta: string) => !delta?.startsWith('-');

    return [
      {
        label:         'Total clientes',
        value:         (data.clientes.totalClientes ?? 0).toLocaleString('es-PE'),
        delta:         data.clientes.deltaTotalClientes ?? '',
        deltaPositive: pos(data.clientes.deltaTotalClientes),
        icon:          'users',
      },
      {
        label:         'Clientes activos',
        value:         (data.clientes.clientesActivosMes ?? 0).toLocaleString('es-PE'),
        delta:         data.clientes.deltaClientesActivos ?? '',
        deltaPositive: pos(data.clientes.deltaClientesActivos),
        icon:          'user-check',
      },
      {
        label:         'Nuevos clientes',
        value:         (data.clientes.nuevosClientes ?? 0).toLocaleString('es-PE'),
        delta:         data.clientes.deltaNuevosClientes ?? '',
        deltaPositive: pos(data.clientes.deltaNuevosClientes),
        icon:          'user-plus',
      },
      {
        label:         'Retención',
        value:         (data.clientes.retencion ?? 0).toFixed(1) + '%',
        delta:         data.clientes.deltaRetencion ?? '',
        deltaPositive: pos(data.clientes.deltaRetencion),
        icon:          'repeat',
      },
      {
        label:         'Servicios realizados',
        value:         (data.barberos.totalBarberos ?? 0).toLocaleString('es-PE'),
        delta:         data.barberos.porcentajeVsAyer ?? '',
        deltaPositive: pos(data.barberos.porcentajeVsAyer),
        icon:          'scissors',
      },
      {
        label:         'Ingresos totales',
        value:         'S/ ' + ingresos.toLocaleString('es-PE', {
                         minimumFractionDigits: 2,
                         maximumFractionDigits: 2,
                       }),
        delta:         '',
        deltaPositive: true,
        icon:          'currency-dollar',
      },
  

    ];
  }
}
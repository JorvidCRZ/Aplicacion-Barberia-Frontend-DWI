import { Injectable, inject } from '@angular/core';  // ← inject faltaba
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, catchError, of } from 'rxjs';
import { TokenService } from '../auth/token.service';
import { ApiResponse, ReservaDTO, ClienteDetalleResumenDTO, ServicioResponseDTO, } from '../../models/gestion/cliente/ClienteResumen.model'; 
import { environment } from '@/environments/environment.development';

const BASE = environment.apiUrl;  

@Injectable({ providedIn: 'root' })
export class ResumenCliente {
  private http         = inject(HttpClient);
  private tokenService = inject(TokenService);

  getClienteId(): number {
    const id = this.tokenService.getUserId();
    if (!id) throw new Error('No hay cliente autenticado');
    return Number(id);
  }

  getUsername(): string {
    return this.tokenService.getDecodedToken()?.sub?.split('@')[0] ?? 'Cliente';
  }

    getKpis(): Observable<ClienteDetalleResumenDTO> {
    return this.http
      .get<ApiResponse<ClienteDetalleResumenDTO>>(`${BASE}/clientes/perfil-propio/resumen`)
      .pipe(map(res => res.data));
  }

  getRecomendados(): Observable<ServicioResponseDTO[]> {
    return this.http
      .get<ApiResponse<any>>(`${BASE}/servicios`)
      .pipe(
        map(res => {
          const data = res.data?.content ?? res.data ?? [];
          return data.slice(0, 3);
        })
      );
  }

cargarDashboard() {
  const reservas$ = this.http
    .get<any>(`${BASE}/reservas/mis-reservas?page=0&size=40`)
    .pipe(
      map(res => res?.data?.content || []),
      catchError(() => of([]))
    );

  return forkJoin({
    reservas:  reservas$,
    kpis:      this.getKpis(),
    servicios: this.getRecomendados(),
  }).pipe(
    map(({ reservas, kpis, servicios }) => {
      console.log('RESERVAS RAW:', reservas);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const proximasCitas = [...reservas]
        .filter((r: any) => {
          const estadosExcluidos = ['CANCELADA', 'RECHAZADA'];
          return new Date(r.fecha) >= hoy && !estadosExcluidos.includes(r.estadoReserva);
        })
        .sort((a: any, b: any) =>
          new Date(`${a.fecha}T${a.horaInicio}`).getTime() -
          new Date(`${b.fecha}T${b.horaInicio}`).getTime()
        )
        .slice(0, 3);

      const historialReciente = [...reservas]
        .sort((a: any, b: any) =>
          new Date(`${b.fecha}T${b.horaInicio}`).getTime() -
          new Date(`${a.fecha}T${a.horaInicio}`).getTime()
        )
        .slice(0, 5);

      return { proximasCitas, historialReciente, kpis, servicios };
    })
  );
}
}
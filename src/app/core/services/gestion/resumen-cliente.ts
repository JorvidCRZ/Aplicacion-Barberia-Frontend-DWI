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

getProximaCita(): Observable<ReservaDTO | null> {
  return this.http
    .get<any>(`${BASE}/reservas/mis-reservas?page=0&size=10`)
    .pipe(
      map((response) => {
        // Extraer reservas de la respuesta paginada
        const reservas: ReservaDTO[] = response?.data?.content || [];
        
        if (reservas.length === 0) return null;

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Filtrar reservas futuras y ordenar por fecha más cercana
        const proximaCita = reservas
          .filter(r => new Date(r.fecha) >= hoy)
          .sort((a, b) => 
            new Date(`${a.fecha}T${a.horaInicio}`).getTime() - 
            new Date(`${b.fecha}T${b.horaInicio}`).getTime()
          )[0] || null;

        console.log('Próxima cita:', proximaCita);
        return proximaCita;
      }),
      catchError((error) => {
        console.error('Error al obtener próxima cita:', error);
        return of(null);
      })
    );
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
    return forkJoin({
      proximaCita: this.getProximaCita(),
      kpis:        this.getKpis(),
      servicios:   this.getRecomendados(),
    });
  }
}
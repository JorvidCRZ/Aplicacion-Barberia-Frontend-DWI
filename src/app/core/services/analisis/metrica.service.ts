import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResumenMetricas, IngresoDiario, ReservasDia, RendimientoBarbero, ServicioSolicitado } from '../../models/analisis/metrica.model';
import { environment } from '@/environments/environment.development';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class MetricaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metricas`;

  private params(desde: string, hasta: string): HttpParams {
    return new HttpParams().set('desde', desde).set('hasta', hasta);
  }

  getResumen(desde: string, hasta: string): Observable<ResumenMetricas> {
    return this.http.get<ApiResponse<ResumenMetricas>>(
      `${this.apiUrl}/resumen`, { params: this.params(desde, hasta) }
    ).pipe(map(r => r.data));
  }

  getIngresosDiarios(desde: string, hasta: string): Observable<IngresoDiario[]> {
    return this.http.get<ApiResponse<IngresoDiario[]>>(
      `${this.apiUrl}/ingresos-diarios`, { params: this.params(desde, hasta) }
    ).pipe(map(r => r.data));
  }

  getReservasPorDia(desde: string, hasta: string): Observable<ReservasDia[]> {
    return this.http.get<ApiResponse<ReservasDia[]>>(
      `${this.apiUrl}/reservas-por-dia`, { params: this.params(desde, hasta) }
    ).pipe(map(r => r.data));
  }

  getRendimientoBarberos(desde: string, hasta: string): Observable<RendimientoBarbero[]> {
    return this.http.get<ApiResponse<RendimientoBarbero[]>>(
      `${this.apiUrl}/rendimiento-barberos`, { params: this.params(desde, hasta) }
    ).pipe(map(r => r.data));
  }

  getServiciosSolicitados(desde: string, hasta: string): Observable<ServicioSolicitado[]> {
    return this.http.get<ApiResponse<ServicioSolicitado[]>>(
      `${this.apiUrl}/servicios-solicitados`, { params: this.params(desde, hasta) }
    ).pipe(map(r => r.data));
  }
}
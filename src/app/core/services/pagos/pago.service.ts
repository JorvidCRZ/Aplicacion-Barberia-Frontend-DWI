import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { ApiResponse } from '../../models/common/index.model';
import { PagoRequest, PagoResponse, HistorialPagoResponse, ReservaPendienteResponse } from '../../models/pagos/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/pagos`; 

  getPagos(cliente?: string): Observable<ApiResponse<PagoResponse[]>> {
    let params = new HttpParams();
    if (cliente) {
      params = params.set('cliente', cliente);
    }
    return this.http.get<ApiResponse<PagoResponse[]>>(this.apiUrl, { params });
  }

  getPagoById(id: number): Observable<ApiResponse<PagoResponse>> {
    return this.http.get<ApiResponse<PagoResponse>>(`${this.apiUrl}/${id}`);
  }

  getHistorialPorPago(pagoId: number): Observable<ApiResponse<HistorialPagoResponse[]>> {
    return this.http.get<ApiResponse<HistorialPagoResponse[]>>(`${this.apiUrl}/${pagoId}/historial`);
  }

  crearPago(dto: PagoRequest): Observable<ApiResponse<PagoResponse>> {
    return this.http.post<ApiResponse<PagoResponse>>(this.apiUrl, dto);
  }

  actualizarPago(id: number, dto: PagoRequest): Observable<ApiResponse<PagoResponse>> {
    return this.http.put<ApiResponse<PagoResponse>>(`${this.apiUrl}/${id}`, dto);
  }

  eliminarPago(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  getReservasPendientesPago(): Observable<ApiResponse<ReservaPendienteResponse[]>> {
    
    return this.http.get<ApiResponse<ReservaPendienteResponse[]>>(`${environment.apiUrl}/reservas/cliente/pendientes-pago`);
  }
}
import { environment } from '@/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Reserva } from '../../models/operaciones/Reserva.model';
import { ApiResponse, Page } from '../../models/common/index.model';
import { ReservaRequest } from '../../models/reserva/reservaRequest';

@Injectable({
  providedIn: 'root',
})
export class ReservaService {

  private API = `${environment.apiUrl}/admin/reservas`;
  private API2 = `${environment.apiUrl}/reservas`;
  private http = inject(HttpClient);

  getReservas(
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<Page<Reserva>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<ApiResponse<Page<Reserva>>>(this.API, { params });
  }

 guardarReserva(reserva: ReservaRequest): Observable<ApiResponse<Reserva>> {
  return this.http.post<ApiResponse<Reserva>>(this.API2, reserva);
}

  
}
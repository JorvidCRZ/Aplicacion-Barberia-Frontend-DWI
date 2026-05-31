import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiResponse } from '../../models/common/index.model';
import { environment } from '@/environments/environment.development';
import { Venta } from '../../models/ventas/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ventas`;

  obtenerVentas(filtro?: any) {
    let params = new HttpParams();

    if (filtro && typeof filtro === 'string' && filtro.trim() !== '') {
      params = params.set('cliente', filtro.trim());
    }

    return this.http.get<ApiResponse<any>>(
      this.apiUrl,
      { params }
    );
  }

  buscarVentaPorId(id: number) {
    return this.http.get<ApiResponse<Venta>>(
      `${this.apiUrl}/${id}`
    );
  }

  crearVenta(data: Venta) {
    return this.http.post<ApiResponse<Venta>>(
      this.apiUrl,
      data
    );
  }

  actualizarVenta(id: number, data: Venta) {
    return this.http.put<ApiResponse<Venta>>(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  eliminarVenta(id: number) {
    return this.http.delete<ApiResponse<void>>(
      `${this.apiUrl}/${id}`
    );
  }
}
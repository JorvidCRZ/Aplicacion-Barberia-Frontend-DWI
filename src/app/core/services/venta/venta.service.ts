import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../../models/common/index.model';
import { environment } from '@/environments/environment.development';
import { Venta } from '../../models/ventas/venta.model';
import { VentaFiltro } from '../../models/ventas/venta.model';
import { buildHttpParamsComponent } from '@/app/shared/utils/build-http-params.component'; 

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ventas`;
  
  obtenerVentas(filtros?: Partial<VentaFiltro>) {
    return this.http.get<ApiResponse<Venta[]>>(
      this.apiUrl,
      { params: buildHttpParamsComponent(filtros) }
    );
  }

  buscarVentaPorId(id: number) {
    return this.http.get<ApiResponse<Venta>>(`${this.apiUrl}/${id}`);
  }

  crearVenta(data: Venta) {
    return this.http.post<ApiResponse<Venta>>(this.apiUrl, data);
  }

  actualizarVenta(id: number, data: Venta) {
    return this.http.put<ApiResponse<Venta>>(`${this.apiUrl}/${id}`, data);
  }

  eliminarVenta(id: number) {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}
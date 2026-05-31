import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { ApiResponse } from '../../models/common/index.model';
import { Recompensa } from '../../models/recompensas/Recompensa.model';

@Injectable({
  providedIn: 'root'
})
export class RecompensaService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/recompensas`;

  // Cliente autenticado ve su propia tarjeta
  getMiTarjeta(): Observable<ApiResponse<Recompensa>> {
    return this.http.get<ApiResponse<Recompensa>>(
      `${this.apiUrl}/mi-tarjeta`
    );
  }

  // Admin / barbero consulta tarjeta de cualquier cliente
  getByClienteId(clienteId: number): Observable<ApiResponse<Recompensa>> {
    return this.http.get<ApiResponse<Recompensa>>(
      `${this.apiUrl}/${clienteId}`
    );
  }
}
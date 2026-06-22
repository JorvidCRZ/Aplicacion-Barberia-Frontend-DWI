import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class IaService {

  private API = `${environment.apiUrl}/ia`;

  constructor(private http: HttpClient) {}

  analizar(foto: Blob, idCliente: number): Observable<any> {
    const formData = new FormData();
    formData.append('foto', foto, 'foto.jpg');
    formData.append('id_cliente', idCliente.toString());
    return this.http.post(`${this.API}/analizar`, formData);
  }

  enviarFeedback(clientId: number, haircutId: number, liked: boolean, rating: number): Observable<any> {
    const params = new HttpParams()
      .set('client_id', clientId.toString())
      .set('haircut_id', haircutId.toString())
      .set('liked', liked.toString())
      .set('rating', rating.toString());
    return this.http.post(`${this.API}/feedback`, null, { params });
  }

  listarCortes(): Observable<any> {
    return this.http.get(`${this.API}/cortes`);
  }

  listarClientes(): Observable<any> {
    return this.http.get(`${this.API}/clientes`);
  }

  obtenerFeatures(idCorte: number): Observable<any> {
    return this.http.get(`${this.API}/features/${idCorte}`);
  }

  actualizarFeatures(idCorte: number, dto: HaircutFeaturesRequestDTO): Observable<any> {
    return this.http.put(`${this.API}/features/${idCorte}`, dto);
  }

  obtenerMiClienteId(): Observable<any> {
  return this.http.get(`${environment.apiUrl}/clientes/mi-cliente`);
}
}



export interface HaircutFeaturesRequestDTO {
  [key: string]: any;
}
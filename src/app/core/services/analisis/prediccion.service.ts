import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PrediccionDia {
  dia: string;
  clientes_predichos: number;
}

export interface PrediccionResponse {
  predicciones: PrediccionDia[];
}

@Injectable({ providedIn: 'root' })
export class PrediccionService {
  private http = inject(HttpClient);
  private flaskUrl = 'http://localhost:5000';

  getPredicciones(): Observable<PrediccionResponse> {
    return this.http.get<PrediccionResponse>(`${this.flaskUrl}/prediccion-clientes`);
  }
}
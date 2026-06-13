import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@/environments/environment.development';
import { FilaSemanal } from '../../models/analisis/reporte.model';
import { ReporteFiltro } from '../../models/analisis/reporte.model';

@Injectable({ providedIn: 'root' })
export class ReporteService {

  private http = inject(HttpClient);
private base = `${environment.apiUrl}/reportes`;

private diasMap: Record<string, string> = {
  'Monday':    'Lunes',
  'Tuesday':   'Martes',
  'Wednesday': 'Miércoles',
  'Thursday':  'Jueves',
  'Friday':    'Viernes',
  'Saturday':  'Sábado',
  'Sunday':    'Domingo',
};

getResumenSemanal(desde: string, hasta: string): Observable<FilaSemanal[]> {
  return this.http
    .get<{ data: FilaSemanal[] }>(`${this.base}/resumen-semanal`, {
      params: { desde, hasta }
    })
    .pipe(map(r => r.data.map(f => ({
      ...f,
      dia: this.diasMap[f.dia] ?? f.dia
    }))));
}

descargarArchivo(tipo: string, formato: string, filtro: ReporteFiltro): Observable<Blob> {
  const params: Record<string, string> = { desde: filtro.desde, hasta: filtro.hasta };
  if (filtro.barberoId)  params['barberoId']  = String(filtro.barberoId);
  if (filtro.servicioId) params['servicioId'] = String(filtro.servicioId);
  if (filtro.estado)     params['estado']     = filtro.estado;
  if (filtro.metodoPago) params['metodoPago'] = filtro.metodoPago;
  return this.http.get(`${this.base}/${tipo}/${formato}`, { params, responseType: 'blob' });
}

getBarberos(): Observable<{id: number, nombre: string}[]> {
  return this.http.get<any>(`${environment.apiUrl}/barberos/lista`).pipe(map(r => r.data));
}

getServicios(): Observable<{id: number, nombre: string}[]> {
  return this.http.get<any>(`${environment.apiUrl}/servicios/lista`).pipe(map(r => r.data));
}
}


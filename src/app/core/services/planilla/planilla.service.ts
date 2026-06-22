import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment.development';
import { ApiResponse, PageResponse } from '../../models/common/index.model';

import {
  PlanillaResumen,
  PlanillaBarbero
} from '../../models/planilla/planilla.model';
import { ResumenBarbero, VentaBarbero } from '../../models/planilla/venta-barbero.model';

@Injectable({
  providedIn: 'root'
})
export class PlanillaService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/planillas`;

  getResumen(
    mes: number,
    anio: number
  ): Observable<ApiResponse<PlanillaResumen>> {

    const params = new HttpParams()
      .set('mes', mes)
      .set('anio', anio);

    return this.http.get<ApiResponse<PlanillaResumen>>(
      `${this.apiUrl}/resumen`,
      { params }
    );
  }

  getDetalle(
    mes: number,
    anio: number,
    page: number = 0,
    size: number = 10
  ): Observable<ApiResponse<PageResponse<PlanillaBarbero>>> {

    const params = new HttpParams()
      .set('mes', mes)
      .set('anio', anio)
      .set('page', page)
      .set('size', size);

    return this.http.get<
      ApiResponse<PageResponse<PlanillaBarbero>>
    >(
      `${this.apiUrl}/detalle`,
      { params }
    );
  }


  obtenerAnios() {
  return this.http.get<ApiResponse<number[]>>(
    `${environment.apiUrl}/planillas/anios`
  );
}

getResumenBarbero(
    barberoId: number,
    mes: number,
    anio: number
  ): Observable<ApiResponse<ResumenBarbero>> {

    const params = new HttpParams()
      .set('mes', mes)
      .set('anio', anio);

    return this.http.get<ApiResponse<ResumenBarbero>>(
      `${this.apiUrl}/barberos/${barberoId}/resumen`,
      { params }
    );
  }

getVentasBarbero(
    barberoId: number,
    mes: number,
    anio: number,
    page: number = 0,
    size: number = 20
  ): Observable<ApiResponse<PageResponse<VentaBarbero>>> {

    const params = new HttpParams()
      .set('mes', mes)
      .set('anio', anio)
      .set('page', page)
      .set('size', size);

    return this.http.get<
      ApiResponse<PageResponse<VentaBarbero>>
    >(
      `${this.apiUrl}/barberos/${barberoId}/ventas`,
      { params }
    );
  }
}
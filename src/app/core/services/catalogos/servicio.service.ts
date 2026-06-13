    import { Injectable, inject } from '@angular/core';
    import { HttpClient } from '@angular/common/http';
    import { Observable } from 'rxjs';
    import { environment } from '@/environments/environment.development';
    import { Servicio, ServicioRequest } from '../../models/catalogos/servicios.model';
    import { ApiResponse, PageResponse } from '../../models/common/index.model';
    import { buildHttpParamsComponent } from '@/app/shared/utils/build-http-params.component';

    @Injectable({
        providedIn: 'root'
    })
    export class ServicioService {

        private apiUrl = `${environment.apiUrl}/servicios`;
        private http = inject(HttpClient);

        obtenerServicioPublicos(filter?: Record<string, any>) {
            return this.http.get<ApiResponse<PageResponse<Servicio>>>(`${this.apiUrl}/publicados`, { params: buildHttpParamsComponent(filter) });
        }

        obtenerServicioPublicosId(id: number) {
            return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/publicados/${id}`);
        }

        obtenerServiciosConFiltro(filter?: Record<string, any>) {
            return this.http.get<ApiResponse<PageResponse<Servicio>>>(this.apiUrl, { params: buildHttpParamsComponent(filter) });
        }

        obtenerPorId(id: number) {
            return this.http.get<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`);
        }

        crearServicio(data: ServicioRequest, archivos?: File[]) {
            return this.http.post<ApiResponse<Servicio>>(this.apiUrl, this.construirFormData(data, archivos));
        }

        actualizarServicio(id: number, data: ServicioRequest, archivos?: File[]) {
            return this.http.put<ApiResponse<Servicio>>(`${this.apiUrl}/${id}`, this.construirFormData(data, archivos));
        }

        eliminarServicio(id: number): Observable<void> {
            return this.http.delete<void>(`${this.apiUrl}/${id}`);
        }

        private construirFormData(data: ServicioRequest, archivos?: File[]): FormData {
            const formData = new FormData();
            formData.append('servicio', new Blob([JSON.stringify(data)], { type: 'application/json' }));
            if (archivos?.length) { archivos.forEach(file => { formData.append('archivos', file); }); }
            return formData;
        }
    }
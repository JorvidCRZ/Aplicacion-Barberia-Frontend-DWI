import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { Servicio, ServicioRequest } from '../../models/catalogos/servicios.model';
import { ApiResponse } from '../../models/common/index.model';

@Injectable({
    providedIn: 'root'
})
export class ServicioService {

    private apiUrl = `${environment.apiUrl}/servicio`;
    private http = inject(HttpClient);

    // falta corregir en el backend para traer bien los endpoints 

    obtenerServicios(): Observable<Servicio[]> {
        return this.http.get<Servicio[]>(this.apiUrl);
    }

    obtenerPorId(id: number): Observable<Servicio> {
        return this.http.get<Servicio>(`${this.apiUrl}/${id}`);
    }

    crearServicio(data: ServicioRequest, archivos?: File[]) {
        return this.http.post<ApiResponse<Servicio>>(this.apiUrl, this.construirFormData(data, archivos));
    }

    actualizarServicio(id: number, data: ServicioRequest): Observable<Servicio> {
        return this.http.put<Servicio>(`${this.apiUrl}/${id}`, data);
    }

    eliminarServicio(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    private construirFormData(data: ServicioRequest, archivos?: File[]): FormData {
        const formData = new FormData();
        formData.append('servicio',new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (archivos?.length) {archivos.forEach(file => {formData.append('archivos', file);});}
        return formData;
    }
}
import { environment } from '@/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ReclamoFiltro } from '../../models/operaciones/reclamos-model/reclamo.filtro.model';
import { ApiResponse, Page } from '../../models/common/index.model';
import { ReclamoPublicoRequest, ReclamoRequest, ReclamoResponse, ReclamoResumen, ReclamoSolucionRequest } from '../../models/operaciones/reclamos-model/reclamo.model';
import { buildHttpParamsComponent } from '@/app/shared/utils/build-http-params.component';


@Injectable({
    providedIn: 'root'
})
export class ReclamoService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/reclamos`;

    listarReclamos(filtro?: ReclamoFiltro) {
        return this.http.get<ApiResponse<Page<ReclamoResponse>>>(this.apiUrl, { params: buildHttpParamsComponent(filtro) });
    }

    obtenerReclamoPorId(id: number) {
        return this.http.get<ApiResponse<ReclamoResponse>>(`${this.apiUrl}/${id}`);
    }

    obtenerResumenReclamos() {
        return this.http.get<ApiResponse<ReclamoResumen>>(`${this.apiUrl}/resumen`);
    }

    crearReclamo(data: ReclamoRequest, archivos?: File[]) {
        return this.http.post<ApiResponse<ReclamoResponse>>(this.apiUrl, this.construirFormData('reclamo', data, archivos));
    }

    crearReclamoPublico(data: ReclamoPublicoRequest, archivos?: File[]) {
        return this.http.post<ApiResponse<ReclamoResponse>>(`${this.apiUrl}/publico`, this.construirFormData('reclamo', data, archivos));
    }

    actualizarSolucionReclamo(id: number, data: ReclamoSolucionRequest) {
        return this.http.put<ApiResponse<ReclamoResponse>>(`${this.apiUrl}/${id}/solucion`, data);
    }

    eliminarReclamo(id: number) {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    private construirFormData(key: string, data: object, archivos?: File[]): FormData {
        const formData = new FormData();
        formData.append(key, new Blob([JSON.stringify(data)], { type: 'application/json' }));
        archivos?.forEach(file => formData.append('archivos', file));
        return formData;
    }
}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Page } from '../../models/common/index.model';

import { of, tap } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { Categoria, CategoriaFilter, CategoriaRequest, CategoriaTipo, } from '../../models/catalogos/categorias.model';
import { buildHttpParamsComponent } from '@/app/shared/utils/build-http-params.component';

@Injectable({
    providedIn: 'root'
})
export class CategoriaService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/categorias`;
    private categoriasCache: Categoria[] | null = null;

    clearCategoriasCache(): void {
        this.categoriasCache = null;
    }

    obtenerCategorias(page = 0, size = 10) {
        return this.http.get<ApiResponse<Page<Categoria>>>(this.apiUrl, { params: buildHttpParamsComponent({ page, size }) });
    }

    obtenerCategoriasConFiltro(filter?: CategoriaFilter) {
        return this.http.get<ApiResponse<Page<Categoria>>>(this.apiUrl, { params: buildHttpParamsComponent(filter) });
    }

    obtenerCategoriasActivas() {
        if (this.categoriasCache) { return of({ data: { content: this.categoriasCache } } as ApiResponse<Page<Categoria>>); }
        return this.http.get<ApiResponse<Page<Categoria>>>(this.apiUrl, { params: buildHttpParamsComponent({ estado: true, size: 1000 }) }).pipe(tap(resp => { this.categoriasCache = resp.data.content; }));
    }

    obtenerCategoriasPorTipo(tipo: CategoriaTipo) {
        return this.http.get<ApiResponse<Page<Categoria>>>(this.apiUrl, {params: buildHttpParamsComponent({estado: true,tipo,size: 1000})});
    }

    buscarCategoriaPorId(id: number) {
        return this.http.get<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`);
    }

    crearCategoria(data: CategoriaRequest) {
        return this.http.post<ApiResponse<Categoria>>(this.apiUrl, data);
    }

    actualizarCategoria(id: number, data: CategoriaRequest) {
        return this.http.put<ApiResponse<Categoria>>(`${this.apiUrl}/${id}`, data);
    }

    cambiarEstado(id: number, estado: boolean) {
        return this.http.patch<ApiResponse<Categoria>>(`${this.apiUrl}/${id}/estado`, {}, { params: buildHttpParamsComponent({ estado }) });
    }
        
    eliminarCategoria(id: number) {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }
}
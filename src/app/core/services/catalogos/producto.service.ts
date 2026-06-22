import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Page } from '../../models/common/index.model';
import { environment } from '@/environments/environment.development';
import { buildHttpParamsComponent } from '@/app/shared/utils/build-http-params.component';
import { Producto, ProductoFiltro, ProductoRequest } from '../../models/catalogos/productos.model';

@Injectable({
    providedIn: 'root'
})
export class ProductoService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/productos`;

    obtenerProductosPublico(filter?: ProductoFiltro) {
        return this.http.get<ApiResponse<Page<Producto>>>(`${this.apiUrl}/publicados`, { params: buildHttpParamsComponent(filter) });
    }

    obtenerProductosPublicoId(id: number) {
        return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/publicados/${id}`);
    }

    obtenerProductoId(id:number){
        return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/${id}`);
    }

    obtenerProductos(page = 0, size = 10) {
        return this.http.get<ApiResponse<Page<Producto>>>(this.apiUrl, { params: buildHttpParamsComponent({ page, size }) });
    }

    obtenerProductosConFiltro(filter?: ProductoFiltro) {
        return this.http.get<ApiResponse<Page<Producto>>>(this.apiUrl, { params: buildHttpParamsComponent(filter) });
    }

    obtenerProductosActivos() {
        return this.http.get<ApiResponse<Page<Producto>>>(this.apiUrl, { params: buildHttpParamsComponent({ estado: true, size: 1000 }) });
    }

    buscarProductoPorId(id: number) {
        return this.http.get<ApiResponse<Producto>>(`${this.apiUrl}/${id}`);
    }

    crearProducto(data: ProductoRequest, imagenes?: File[]) {
        return this.http.post<ApiResponse<Producto>>(this.apiUrl, this.construirFormData(data, imagenes));
    }

    actualizarProducto(id: number, data: ProductoRequest, imagenes?: File[]) {
        return this.http.put<ApiResponse<Producto>>(`${this.apiUrl}/${id}`, this.construirFormData(data, imagenes));
    }

    cambiarEstado(id: number, estado: boolean) {
        return this.http.patch<ApiResponse<Producto>>(`${this.apiUrl}/${id}/estado`, {}, { params: buildHttpParamsComponent({ estado }) });
    }

    cambiarPublicado(id: number, publicado: boolean) {
        return this.http.patch<ApiResponse<Producto>>(`${this.apiUrl}/${id}/publicacion`, {}, { params: buildHttpParamsComponent({ publicado }) });
    }

    eliminarProducto(id: number) {
        return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
    }

    private construirFormData(data: ProductoRequest, imagenes?: File[]): FormData {
        const formData = new FormData();
        formData.append('producto', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (imagenes && imagenes.length > 0) { imagenes.forEach(img => { formData.append('archivos', img); }); }
        return formData;
    }
}
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@/environments/environment.development';
import { ApiResponse, Page } from '../../models/common/index.model';
import { Barbero } from '../../models/gestion/barbero/barbero.model';
import { ResumenGeneralBarbero } from '../../models/gestion/barbero/barbero-resumen.model';
import { ResumenIndividualBarbero } from '../../models/gestion/barbero/barbero-resumen-individual.model';
import { PerfilBarbero, StatsHoy, Cita, ResumenSemanal, EstadoResponse } from '../../models/gestion/barbero/barbero-resumen-individual.model';

export type EstadoBarberoBusqueda = 'todos' | 'disponible' | 'ocupado';
export type OrdenarBarberoPor = 'fechaIngreso' | 'experiencia' | 'sueldo' | 'comision';
export type DireccionOrden = 'asc' | 'desc';

export interface FiltroBarberoBusqueda {
    estado?: EstadoBarberoBusqueda;
    ordenarPor?: OrdenarBarberoPor;
    direccion?: DireccionOrden;
}

@Injectable({
    providedIn: 'root'
})
export class BarberoService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/barberos`;

    listar(
        page: number = 0,
        size: number = 5
    ): Observable<ApiResponse<Page<Barbero>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<Barbero>>>(
            this.apiUrl,
            { params }
        );
    }

    listarInhabilitados(
        page: number = 0,
        size: number = 5
    ): Observable<ApiResponse<Page<Barbero>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<Barbero>>>(
            `${this.apiUrl}/inhabilitados`,
            { params }
        );
    }
    deshabilitar(id: number): Observable<ApiResponse<string>> {

        return this.http.patch<ApiResponse<string>>(
            `${this.apiUrl}/${id}/deshabilitar`,
            {}
        );
    }

    reactivar(id: number): Observable<ApiResponse<string>> {

        return this.http.patch<ApiResponse<string>>(
            `${this.apiUrl}/${id}/reactivar`,
            {}
        );
    }
    buscar(
        filtros: FiltroBarberoBusqueda = {},
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<Page<Barbero>>> {

        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (filtros.estado && filtros.estado !== 'todos') {
            params = params.set('estado', filtros.estado);
        }

        if (filtros.ordenarPor) {
            params = params.set('ordenarPor', filtros.ordenarPor);
        }

        if (filtros.direccion) {
            params = params.set('direccion', filtros.direccion);
        }

        return this.http.get<ApiResponse<Page<Barbero>>>(
            `${this.apiUrl}/buscar`,
            { params }
        );
    }

    buscarPorNombre(
        termino: string = '',
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<Page<Barbero>>> {
        const params = new HttpParams()
            .set('q', termino.trim())
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<Barbero>>>(
            `${this.apiUrl}/buscar-nombre`,
            { params }
        );
    }

    obtenerPorId(id: number): Observable<ApiResponse<Barbero>> {
        return this.http.get<ApiResponse<Barbero>>(
            `${this.apiUrl}/${id}`
        );
    }

    crear(data: Partial<Barbero>): Observable<ApiResponse<Barbero>> {
        return this.http.post<ApiResponse<Barbero>>(
            this.apiUrl,
            data
        );
    }

    actualizar(id: number, data: Partial<Barbero>): Observable<ApiResponse<Barbero>> {
        return this.http.patch<ApiResponse<Barbero>>(
            `${this.apiUrl}/actualizar/${id}`,
            data
        );
    }

    eliminar(id: number): Observable<ApiResponse<Barbero>> {
        return this.http.delete<ApiResponse<Barbero>>(
            `${this.apiUrl}/eliminar/${id}`
        );
    }

    obtenerResumenGeneral(): Observable<ApiResponse<ResumenGeneralBarbero>> {
        return this.http.get<ApiResponse<ResumenGeneralBarbero>>(
            `${this.apiUrl}/resumen-general`
        );
    }

    obtenerResumenIndividual(id: number): Observable<ApiResponse<ResumenIndividualBarbero>> {
        return this.http.get<ApiResponse<ResumenIndividualBarbero>>(
            `${this.apiUrl}/${id}/resumen`
        );
    }


getPerfil(): Observable<ApiResponse<PerfilBarbero>> {
    return this.http.get<ApiResponse<PerfilBarbero>>(
        `${environment.apiUrl}/barberos/perfil-propio`
    );
}

toggleOcupado(id: number): Observable<ApiResponse<EstadoResponse>> {
    return this.http.patch<ApiResponse<EstadoResponse>>(
        `${this.apiUrl}/${id}/ocupado`,
        {}
    );
}

getStatsHoy(id: number): Observable<ApiResponse<StatsHoy>> {
    return this.http.get<ApiResponse<StatsHoy>>(
        `${environment.apiUrl}/barbero/reservas/barbero/${id}/hoy`
    );
}

getCitasHoy(): Observable<ApiResponse<Cita[]>> {
    return this.http.get<ApiResponse<Cita[]>>(
        `${environment.apiUrl}/barbero/citas/hoy`
    );
}

getResumenSemanal(id: number): Observable<ApiResponse<ResumenSemanal>> {
    return this.http.get<ApiResponse<ResumenSemanal>>(
        `${environment.apiUrl}/barbero/reservas/barbero/${id}/semanal`
    );
}

logout(): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
        `${environment.apiUrl}/auth/logout`,
        {}
    );
}

}
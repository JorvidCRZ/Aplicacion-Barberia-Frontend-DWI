import { environment } from '@/environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ClienteRegister } from '../../models/auth/usuario/cliente-register.model';
import { ResetPasswordRequest } from '../../models/auth/usuario/reset-password-request.model';
import { UpdateUsernameRequest } from '../../models/auth/usuario/update-username-request.model';
import { BarberoRegister } from '../../models/auth/usuario/barbero-register.model';
import { ApiResponse, Page } from '../../models/common/index.model';
import { AssignRolesRequest, Permiso, Rol, UsuarioTablaResponse } from '../../models/gestion/usuario.model';
import { AdminRegister } from '../../models/auth/usuario/admin-register.model';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/usuarios`;

    registrarCliente(data: ClienteRegister): Observable<any> {
        const payload = { ...data, idRol: 3 } as ClienteRegister;
        return this.http.post<ClienteRegister>(
            `${this.apiUrl}/cliente`,
            payload
        );
    }

    registrarBarbero(data: BarberoRegister): Observable<any> {
        return this.http.post<BarberoRegister>(
            `${this.apiUrl}/barbero`,
            data
        );
    }

    registrarAdmin(data: AdminRegister): Observable<any> {
        const payload = { ...data, idRol: 1 } as AdminRegister; // igual que haces con cliente (idRol: 3)
        return this.http.post<any>(
            `${this.apiUrl}/admin`,
            payload
        );
    }

    resetPassword(idUsuario: number, data: ResetPasswordRequest): Observable<any> {
        return this.http.put<any>(
            `${this.apiUrl}/${idUsuario}/reset-password`,
            data
        );
    }

    updateUsername(idUsuario: number, data: UpdateUsernameRequest): Observable<any> {
        return this.http.patch<any>(
            `${this.apiUrl}/${idUsuario}/username-update`,
            data
        );
    }

    obtenerPorId(idUsuario: number): Observable<ApiResponse<any>> {
        return this.http.get<ApiResponse<any>>(
            `${this.apiUrl}/${idUsuario}`
        );
    }

    generateQr(idUsuario: number): Observable<Blob> {
        return this.http.get(`${this.apiUrl}/${idUsuario}/qr`, { responseType: 'blob' });
    }

    getQrUrl(idUsuario: number): string {
        return `${this.apiUrl}/${idUsuario}/qr`;
    }

    regenerarQr(idUsuario: number): Observable<Blob> {
        return this.http.post(
            `${this.apiUrl}/${idUsuario}/qr/regenerar`,
            {},
            { responseType: 'blob' }
        );
    }

    asignarPin(idUsuario: number, pin: string): Observable<any> {
    return this.http.patch<any>(
        `${this.apiUrl}/${idUsuario}/pin`,
        { pin }
    );
}

    listar(page: number = 0, size: number = 10): Observable<ApiResponse<Page<UsuarioTablaResponse>>> {
        const params = new HttpParams().set('page', page).set('size', size);
        return this.http.get<ApiResponse<Page<UsuarioTablaResponse>>>(`${this.apiUrl}/tabla`, { params });
    }

    filtrar(
        filtros: {
            rol?: string;
            tieneQr?: boolean;
            multiplesRoles?: boolean;
        },
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<Page<UsuarioTablaResponse>>> {

        let params = new HttpParams()
            .set('page', page)
            .set('size', size);

        if (filtros.rol) {
            params = params.set('rol', filtros.rol);
        }

        if (filtros.tieneQr !== undefined) {
            params = params.set(
                'tieneQr',
                filtros.tieneQr
            );
        }

        if (filtros.multiplesRoles !== undefined) {
            params = params.set(
                'multiplesRoles',
                filtros.multiplesRoles
            );
        }

        return this.http.get<ApiResponse<Page<UsuarioTablaResponse>>>(
            `${this.apiUrl}/filtrar`,
            { params }
        );
    }

    buscar(
        texto: string,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<Page<UsuarioTablaResponse>>> {

        const params = new HttpParams()
            .set('texto', texto)
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<UsuarioTablaResponse>>>(
            `${this.apiUrl}/buscar`,
            { params }
        );
    }


    asignarRoles(
        idUsuario: number,
        data: AssignRolesRequest
    ): Observable<any> {

        return this.http.patch<any>(
            `${this.apiUrl}/${idUsuario}/roles`,
            data
        );
    }

    quitarRol(
        idUsuario: number,
        idRol: number
    ): Observable<any> {

        return this.http.delete<any>(
            `${this.apiUrl}/${idUsuario}/roles/${idRol}`
        );
    }


    listarRoles(): Observable<ApiResponse<Rol[]>> {
        return this.http.get<ApiResponse<Rol[]>>(
            `${this.apiUrl}/roles`
        );
    }

    obtenerRolesUsuario(
        idUsuario: number
    ): Observable<ApiResponse<Rol[]>> {

        return this.http.get<ApiResponse<Rol[]>>(
            `${this.apiUrl}/${idUsuario}/roles`
        );
    }

    obtenerPermisosUsuario(
        idUsuario: number,
        page: number = 0,
        size: number = 10
    ): Observable<ApiResponse<Page<Permiso>>> {

        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<ApiResponse<Page<Permiso>>>(
            `${this.apiUrl}/${idUsuario}/permisos`,
            { params }
        );
    }



}
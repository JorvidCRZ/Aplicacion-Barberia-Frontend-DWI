import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@/environments/environment.development';


import { PersonaUpdateRequest } from '../../models/gestion/persona/persona-update.model';
import { ApiResponse } from '../../models/common/index.model';

@Injectable({
    providedIn: 'root'
})
export class PersonaService {

    private http = inject(HttpClient);

    private apiUrl = `${environment.apiUrl}/personas`;

    actualizarPersona(
        personaId: number,
        body: PersonaUpdateRequest
    ): Observable<ApiResponse<PersonaUpdateRequest>> {

        return this.http.patch<ApiResponse<PersonaUpdateRequest>>(
            `${this.apiUrl}/actualizar/${personaId}`,
            body
        );
    }

    actualizarPersonaPorUsuarioId(
    usuarioId: number,
    body: PersonaUpdateRequest
): Observable<ApiResponse<any>> {
    return this.http.patch<ApiResponse<any>>(
        `${this.apiUrl}/actualizar/por-usuario/${usuarioId}`,
        body
    );
}



}
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../../../environments/environment.development';
import { RefreshRequest } from '../../models/auth/refreshRequest.model';
import { LoginRequest, LoginResponse } from '../../models/auth/loginResponse.model';
import { ApiResponse } from '../../models/common/index.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private API = environment.apiUrl + '/auth';
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<ApiResponse<LoginResponse>>(this.API + "/login", data).pipe(map(res => res.data), tap(data => {
      this.tokenService.saveAccessToken(data.accessToken);
      this.tokenService.saveRefreshToken(data.refreshToken);
    }));
  }

  refreshToken(): Observable<ApiResponse<LoginResponse>> {
    const token = this.tokenService.getRefreshToken();
    const body: RefreshRequest = { refreshToken: token! };
    return this.http.post<ApiResponse<LoginResponse>>(this.API + "/refresh", body);
  }

  logout() {
    this.tokenService.clearTokens();
  }

// auth.service.ts
register(data: {
  username: string;
  password: string;
  idRol: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}): Observable<ApiResponse<any>> {
  return this.http.post<ApiResponse<any>>(environment.apiUrl + "/usuarios/cliente", data);
}
}

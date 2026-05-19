import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private PermisosSubject = new BehaviorSubject<string[]>([]);
  permisos$ = this.PermisosSubject.asObservable();

  saveAccessToken(token: string) {
    localStorage.setItem(this.ACCESS_TOKEN, token);
    const permisos = this.getPermisos();
    this.PermisosSubject.next(permisos);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  saveRefreshToken(token: string) {
    localStorage.setItem(this.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    this.PermisosSubject.next([]);
  }

  isLogged(): boolean {
    return !!this.getAccessToken();
  }

  private getDecodedToken(): any | null {
    try {
      const token = this.getAccessToken();
      if (!token || token.split('.').length !== 3) {
        return null;
      }
      return jwtDecode(token);
    } catch {
      return null;
    }
  }

  getRoles(): string[] {
    return this.getDecodedToken()?.roles || [];
  }

  getPermisos(): string[] {
    return this.getDecodedToken()?.permisos || [];
  }

  getUserDisplayName(): string {
    const decoded = this.getDecodedToken();
    if (!decoded) return '';
    return decoded.fullName || decoded.nombreCompleto || decoded.name || decoded.sub || '';
  }

  initPermisos() {
    const permisos = this.getPermisos();
    this.PermisosSubject.next(permisos);
  }

  getHomeByRole(): string {

    const roles = this.getRoles();

    if (roles.includes('ROLE_admin')) {
      return '/dashboard/admin';
    }

    if (roles.includes('ROLE_barbero')) {
      return '/dashboard/barbero';
    }

    if (roles.includes('ROLE_cliente')) {
      return '/dashboard/cliente';
    }

    return '/login';
  }

  getPrimaryRole(): string {

    const roles = this.getRoles();

    if (roles.includes('ROLE_admin')) {
      return 'admin';
    }

    if (roles.includes('ROLE_barbero')) {
      return 'barbero';
    }

    if (roles.includes('ROLE_cliente')) {
      return 'cliente';
    }

    return '';
  }
}

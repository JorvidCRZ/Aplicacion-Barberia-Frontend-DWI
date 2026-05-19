import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  // No añadir Authorization a endpoints de autenticación
  const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/refresh');
  
  let authReq = req;
  if (!isAuthEndpoint) {
    const token = tokenService.getAccessToken();
    if (token) {authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });}
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Solo intentar refresh si NO es un endpoint de auth y es 401
      if (error.status === 401 && !isAuthEndpoint) {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
          tokenService.clearTokens();
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap(response => {
            tokenService.saveAccessToken(response.data.accessToken);
            const retryReq = req.clone({ setHeaders: { Authorization: `Bearer ${response.data.accessToken}` }});
            return next(retryReq);
          }),
          catchError((refreshError: any) => {
            tokenService.clearTokens();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
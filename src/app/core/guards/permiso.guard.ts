import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/auth/token.service';

export const permisoGuardGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);

  const permission = tokenService.getPermisos();
  const permisosPermitidos = route.data['permission'];

  const authorized = permission.some(p =>permisosPermitidos.includes(p));

  if (authorized) {
    return true;
  }
  
  router.navigate(['/dashboard']);

  return false;
};

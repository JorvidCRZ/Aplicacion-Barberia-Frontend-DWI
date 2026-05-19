import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/auth/token.service';

export const rolGuardsGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  const rolesUsuario = tokenService.getRoles();
  const rolesPermitidos = route.data['roles'];

  const authorized = rolesUsuario.some(r => rolesPermitidos.includes(r));

  if (authorized) {
    return true;
  }
  if (rolesUsuario.includes('ROLE_cliente')) {
    router.navigate(['/app']);
  } else {
    router.navigate(['/dashboard']);
  }

  return false;
};

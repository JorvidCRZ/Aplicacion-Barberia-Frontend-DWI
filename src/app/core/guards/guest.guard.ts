import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/auth/token.service';

export const guestGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (tokenService.isLogged()) {
    return router.createUrlTree([tokenService.getHomeByRole()]);

  }
  return true;
};

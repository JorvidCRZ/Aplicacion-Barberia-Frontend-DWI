import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../services/auth/token.service';

export const authGuard: CanActivateFn = (state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);


  if (tokenService.isLogged()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });


};

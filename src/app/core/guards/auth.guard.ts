import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth-store.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  if (authStore.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
};

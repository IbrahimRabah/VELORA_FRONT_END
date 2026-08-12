import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth-store.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  if (authStore.isAdmin()) {
    return true;
  }

  // Not signed in at all -> give them a chance to log in; signed in but not an admin -> 403.
  if (!authStore.isLoggedIn()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  return router.createUrlTree(['/403']);
};

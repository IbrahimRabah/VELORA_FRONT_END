import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthStoreService } from '../state/auth-store.service';

// Keeps a signed-in visitor off the login page — not the whole /auth/** subtree, since
// otp-verify (CHANGE_PHONE) and password reset are legitimately used while signed in.
export const guestOnlyGuard: CanActivateFn = () => {
  const authStore = inject(AuthStoreService);
  const router = inject(Router);

  return authStore.isLoggedIn() ? router.createUrlTree(['/']) : true;
};

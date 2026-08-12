import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { CartApiService } from '../services/api/cart-api.service';
import { CartStoreService } from '../state/cart-store.service';

export const checkoutReadyGuard: CanActivateFn = (): boolean | UrlTree | Observable<boolean | UrlTree> => {
  const platformId = inject(PLATFORM_ID);

  // SSR renders as a stateless guest and never has a cart to check — same rule as the
  // APP_INITIALIZER. Making the real HttpClient call here would hit a relative URL with
  // no browser origin to resolve it against and blow up prerendering. The real check
  // still runs client-side once this route is actually navigated to in the browser.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const cartStore = inject(CartStoreService);
  const cartApi = inject(CartApiService);
  const router = inject(Router);

  const decide = (): boolean | UrlTree => (cartStore.checkoutReady() ? true : router.createUrlTree(['/cart']));

  // Cart already loaded (e.g. from a prior page) — decide synchronously.
  if (cartStore.cart() !== null) {
    return decide();
  }

  // Not loaded yet — load it first, then decide, per the plan.
  return cartApi.getCart().pipe(
    tap((cart) => cartStore.set(cart)),
    map(() => decide()),
    catchError(() => of(router.createUrlTree(['/cart']))),
  );
};

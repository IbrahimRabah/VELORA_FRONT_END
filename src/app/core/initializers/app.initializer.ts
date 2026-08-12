import { isPlatformBrowser } from '@angular/common';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';

import { AuthApiService } from '../services/api/auth-api.service';
import { CartApiService } from '../services/api/cart-api.service';
import { GuestTokenService } from '../services/guest-token.service';
import { AuthStoreService } from '../state/auth-store.service';
import { CartStoreService } from '../state/cart-store.service';
import { LanguageStoreService } from '../state/language-store.service';

/**
 * Runs once at bootstrap, in this exact order:
 *   أ. Reading the language and applying lang/dir to documentElement already happens as
 *      a side effect of constructing LanguageService (isPlatformBrowser-guarded there) —
 *      listing LanguageStoreService as a dependency below is what forces that construction.
 *   ب. auth.store.restore() hydrates from whatever a previous session persisted. If that
 *      leaves us logged in, POST /auth/me confirms the session is still valid server-side.
 *      A failure (expired/revoked token) just means the stored session is stale — clear it
 *      quietly and continue rendering as a guest, no error surfaced to the user.
 *   ج. Only an anonymous visitor needs a guest cart token — a signed-in caller's cart
 *      resolves through the Bearer token instead (it takes priority over X-Guest-Token).
 *   د. Load the cart either way and put the response straight into cart.store.
 *
 * Entirely skipped on the server: SSR renders as a stateless guest and makes no network
 * calls at all here.
 */
export function appInitializer(
  platformId: object,
  languageStore: LanguageStoreService,
  authStore: AuthStoreService,
  authApi: AuthApiService,
  guestTokenService: GuestTokenService,
  cartApi: CartApiService,
  cartStore: CartStoreService,
): () => Observable<void> {
  return () => {
    void languageStore; // step أ — construction alone is what matters, see doc comment above

    if (!isPlatformBrowser(platformId)) {
      return of(undefined);
    }

    authStore.restore();

    const sessionConfirmed$: Observable<void> = authStore.isLoggedIn()
      ? authApi.me().pipe(
          map(() => undefined),
          catchError(() => {
            authStore.clear();
            return of(undefined);
          }),
        )
      : of(undefined);

    return sessionConfirmed$.pipe(
      switchMap(() => (authStore.isLoggedIn() ? of('') : guestTokenService.ensureToken())),
      switchMap(() => cartApi.getCart()),
      tap((cart) => cartStore.set(cart)),
      map(() => undefined),
      // The cart failing to load shouldn't block the app from bootstrapping.
      catchError(() => of(undefined)),
    );
  };
}

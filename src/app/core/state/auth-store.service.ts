import { Injectable, computed, inject, signal } from '@angular/core';

import { AuthResponse, UserResponse } from '../models';
import { TokenStorageService } from '../services/token-storage.service';

/**
 * Reactive wrapper around TokenStorageService — no HTTP calls in here, only signal state.
 * Whoever calls the API (auth-api.service via a component/guard) is responsible for
 * feeding the response back in through setSession()/setUser()/clear().
 *
 * IMPORTANT: POST /auth/me returns firstName/lastName/fullName = null (built from JWT
 * claims, not a DB lookup) — see the same warning on TokenStorageService. restore() must
 * read the `user` object already persisted by a previous login/register, not call /auth/me
 * for it. /auth/me is only good for confirming the session is still valid and refreshing
 * roles/verification flags — its response must NEVER be passed to setUser() wholesale, or
 * it will overwrite a real name with null.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthStoreService {
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly _user = signal<UserResponse | null>(null);
  // False until restore() (or a fresh setSession()/clear()) has run once — guards can
  // wait on this before deciding whether to redirect an unauthenticated visitor.
  private readonly _isReady = signal(false);

  readonly user = this._user.asReadonly();
  readonly isReady = this._isReady.asReadonly();

  readonly isLoggedIn = computed(() => this._user() !== null);
  // TODO: not in contract — only the "CUSTOMER" role literal is ever shown in an example;
  // "ADMIN" is inferred from the ROLE_ADMIN / "Admin only" wording elsewhere in the contract.
  readonly isAdmin = computed(() => this._user()?.roles.includes('ADMIN') ?? false);

  setSession(auth: AuthResponse): void {
    this.tokenStorage.setSession(auth);
    this._user.set(auth.user);
    this._isReady.set(true);
  }

  setUser(user: UserResponse): void {
    this.tokenStorage.setUser(user);
    this._user.set(user);
  }

  clear(): void {
    this.tokenStorage.clear();
    this._user.set(null);
    this._isReady.set(true);
  }

  // Call once at startup (APP_INITIALIZER) to hydrate from whatever a previous session
  // already persisted.
  restore(): void {
    this._user.set(this.tokenStorage.getUser());
    this._isReady.set(true);
  }
}

import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { Observable, finalize, map, of, shareReplay, tap } from 'rxjs';

import { API_ROUTES } from '../constants/api-routes';
import { GuestTokenResponse } from '../models';

const COOKIE_NAME = 'velora_guest_token';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365; // 1 year

/**
 * POST /api/v1/cart/guest-token issues a server-signed `uuid.signature` token — the
 * client must NEVER generate this UUID itself (that was the security hole this replaced).
 * Stored in a cookie (not localStorage) so it travels the same way the backend expects
 * and survives SSR requests.
 */
@Injectable({
  providedIn: 'root',
})
export class GuestTokenService {
  // Built directly on HttpBackend, bypassing every interceptor. This service is consumed
  // by GuestTokenInterceptor, so depending on the normal (intercepted) HttpClient here
  // would make constructing HttpClient depend on constructing that interceptor, which
  // depends on this service, which depends on HttpClient again — Angular throws NG0200
  // the moment any request is made. It also sidesteps a nonsensical self-reference:
  // guest-token.interceptor would otherwise try to attach X-Guest-Token to the very
  // request that issues that token.
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  // Single in-flight POST shared by every concurrent caller — see request() below.
  private pendingRequest$: Observable<string> | null = null;

  /**
   * Synchronous read for the interceptor. Always null on the server — SSR never carries
   * a guest cookie of its own.
   */
  getToken(): string | null {
    return this.readCookie();
  }

  /**
   * Returns the current token if the cookie is already set, otherwise requests a new one
   * from the server. Concurrent calls made before the request resolves all share the same
   * HTTP call via shareReplay(1) — they never race each other into requesting two tokens.
   * On the server this makes no network call at all (SSR renders anonymously).
   */
  ensureToken(): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return of('');
    }

    const existing = this.readCookie();
    if (existing) {
      return of(existing);
    }

    return this.request();
  }

  /**
   * Forces a new token, bypassing whatever is currently stored. Call this on
   * 401 TOKEN_INVALID for cart/order/shipping requests.
   */
  refresh(): Observable<string> {
    if (!isPlatformBrowser(this.platformId)) {
      return of('');
    }

    this.deleteCookie();
    this.pendingRequest$ = null;
    return this.request();
  }

  /**
   * Drops the stored token without requesting a new one — call after a successful cart
   * merge into a signed-in account, and after a successful guest checkout.
   */
  clear(): void {
    this.deleteCookie();
    this.pendingRequest$ = null;
  }

  private request(): Observable<string> {
    if (!this.pendingRequest$) {
      this.pendingRequest$ = this.http.post<GuestTokenResponse>(API_ROUTES.cart.guestToken(), null).pipe(
        map((response) => response.guestToken),
        tap((token) => this.writeCookie(token)),
        // Runs once per underlying HTTP call (shareReplay multicasts it), not once per
        // subscriber — the next ensureToken() call after this one starts a fresh request.
        finalize(() => {
          this.pendingRequest$ = null;
        }),
        shareReplay(1),
      );
    }
    return this.pendingRequest$;
  }

  private readCookie(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const match = this.document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    return match ? decodeURIComponent(match[1]) : null;
  }

  private writeCookie(token: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.document.cookie = `${COOKIE_NAME}=${encodeURIComponent(token)}; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
  }

  private deleteCookie(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.document.cookie = `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`;
  }
}

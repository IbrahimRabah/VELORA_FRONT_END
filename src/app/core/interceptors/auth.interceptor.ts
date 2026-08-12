import { Injectable, inject } from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, shareReplay, switchMap, tap, throwError } from 'rxjs';

import { API_ROUTES } from '../constants/api-routes';
import { ErrorCode } from '../enums/error-code';
import { AuthResponse, isApiError } from '../models';
import { TokenStorageService } from '../services/token-storage.service';
import { isGuestTokenScopeUrl } from './guest-scope.util';
/** Public auth endpoints — a 401 here is the answer, not an expired session. */
const PUBLIC_AUTH_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/password/forgot',
  '/auth/password/reset',
  '/auth/otp/send',
  '/auth/otp/verify',
] as const;
/**
 * Attaches Authorization from the stored access token, and — on 401 — tells apart four
 * situations the contract treats completely differently (see intercept() below). Getting
 * this wrong either logs a user out on a wrong password, or infinite-loops refreshing a
 * dead session.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  // Built directly on HttpBackend, bypassing every interceptor (including this one).
  // Injecting the normal (intercepted) HttpClient here would make constructing HttpClient
  // depend on constructing AuthInterceptor, which depends on HttpClient again — Angular
  // throws NG0200 (circular DI) the moment any request is made.
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  // Single in-flight refresh shared by every request that races into a 401 at once —
  // the refresh token rotates server-side, so a second concurrent call would fail.
  private refreshInProgress$: Observable<AuthResponse> | null = null;

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.tokenStorage.getAccessToken();
    const authorizedReq = accessToken ? this.withAuth(req, accessToken) : req;

    return next.handle(authorizedReq).pipe(catchError((err: unknown) => this.handle401(err, req, next)));
  }

  private handle401(err: unknown, req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
      return throwError(() => err);
    }

    const code = isApiError(err.error) ? err.error.code : undefined;

    // Case 2 — the refresh call itself came back 401 (invalid/expired/rotated-away
    // refresh token): the session is unrecoverable. Checked first and by URL alone
    // ("any code"), since this must win even if the code happens to match another case.
    if (req.url === API_ROUTES.auth.refresh()) {
      this.clearSessionAndRedirect();
      return throwError(() => err);
    }

    // Case 3 — wrong credentials on login is a *correct* 401, not an expired session.
    // Never refresh, never sign out — just let the login form see it.
    if (code === ErrorCode.INVALID_CREDENTIALS) {
      return throwError(() => err);
    }

    // Case 4 — a broken guest-cart token, not an access-token problem. This interceptor
    // stays out of it; guest-token.interceptor (next in the response chain going out)
    // owns the retry.
    if (code === ErrorCode.TOKEN_INVALID && isGuestTokenScopeUrl(req.url)) {
      return throwError(() => err);
    }

    // Case 1 — an expired/missing access token on any other endpoint: refresh once and
    // replay the original request with the new token.
  const isPublicAuthPath = PUBLIC_AUTH_PATHS.some((p) => req.url.includes(p));

    if (code === ErrorCode.UNAUTHORIZED && !isPublicAuthPath) {
      if (!this.tokenStorage.getRefreshToken()) {
        this.clearSessionAndRedirect();
        return throwError(() => err);
      }

      return this.performRefresh().pipe(
        switchMap((auth) => next.handle(this.withAuth(req, auth.accessToken))),
        catchError((refreshErr: unknown) => {
          this.clearSessionAndRedirect();
          return throwError(() => refreshErr);
        }),
      );
    }

    return throwError(() => err);
  }

  private performRefresh(): Observable<AuthResponse> {
    if (!this.refreshInProgress$) {
      const refreshToken = this.tokenStorage.getRefreshToken();
      this.refreshInProgress$ = this.http
        .post<AuthResponse>(API_ROUTES.auth.refresh(), { refreshToken })
        .pipe(
          tap((auth) => this.tokenStorage.setSession(auth)),
          // Fires once per underlying call (shareReplay multicasts it) — the next 401
          // starts a fresh refresh rather than replaying this one forever.
          finalize(() => {
            this.refreshInProgress$ = null;
          }),
          shareReplay(1),
        );
    }
    return this.refreshInProgress$;
  }

  private withAuth(req: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
  }

  private clearSessionAndRedirect(): void {
    this.tokenStorage.clear();
    void this.router.navigateByUrl('/auth/login');
  }
}

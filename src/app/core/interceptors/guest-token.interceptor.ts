import { Injectable, inject } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';

import { ErrorCode } from '../enums/error-code';
import { isApiError } from '../models';
import { GuestTokenService } from '../services/guest-token.service';
import { isGuestTokenScopeUrl } from './guest-scope.util';

// Internal bookkeeping only — never sent over the wire. Guards the "retry once" rule so
// a guest token that keeps failing can't loop forever.
export const GUEST_TOKEN_RETRIED = new HttpContextToken<boolean>(() => false);

/**
 * Adds X-Guest-Token to cart/orders/shipping-quote requests — but only when there's no
 * Authorization header (auth.interceptor runs first in the request direction, so by the
 * time this interceptor sees the request, a signed-in caller's Bearer token is already
 * attached and takes priority per the contract).
 */
@Injectable()
export class GuestTokenInterceptor implements HttpInterceptor {
  private readonly guestTokenService = inject(GuestTokenService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!isGuestTokenScopeUrl(req.url) || req.headers.has('Authorization')) {
      return next.handle(req);
    }

    return next.handle(this.withGuestToken(req)).pipe(
      catchError((err: unknown) => {
        if (!(err instanceof HttpErrorResponse) || err.status !== 401) {
          return throwError(() => err);
        }

        const code = isApiError(err.error) ? err.error.code : undefined;
        const alreadyRetried = req.context.get(GUEST_TOKEN_RETRIED);
        if (code !== ErrorCode.TOKEN_INVALID || alreadyRetried) {
          return throwError(() => err);
        }

        return this.guestTokenService.refresh().pipe(
          switchMap((token) => {
            const retriedReq = req.clone({
              setHeaders: token ? { 'X-Guest-Token': token } : {},
              context: req.context.set(GUEST_TOKEN_RETRIED, true),
            });
            return next.handle(retriedReq);
          }),
        );
      }),
    );
  }

  private withGuestToken(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = this.guestTokenService.getToken();
    return token ? req.clone({ setHeaders: { 'X-Guest-Token': token } }) : req;
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';

import { LoadingService } from '../services/loading.service';

/**
 * Counts in-flight requests via LoadingService. A request carrying the `X-Silent` header
 * is excluded from the counter and never reaches the backend with that header — it's
 * stripped here before the request is sent.
 */
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private readonly loadingService = inject(LoadingService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const silent = req.headers.has('X-Silent');

    if (silent) {
      return next.handle(req.clone({ headers: req.headers.delete('X-Silent') }));
    }

    this.loadingService.show();
    return next.handle(req).pipe(finalize(() => this.loadingService.hide()));
  }
}

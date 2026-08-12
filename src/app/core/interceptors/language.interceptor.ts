import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LanguageService } from '../services/language.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {
  private readonly languageService = inject(LanguageService);

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const requestWithLang = req.clone({
      setHeaders: { 'Accept-Language': this.languageService.getCurrentLanguage() },
    });
    return next.handle(requestWithLang);
  }
}

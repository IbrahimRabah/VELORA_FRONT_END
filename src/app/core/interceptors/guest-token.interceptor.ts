import { HttpInterceptorFn } from '@angular/common/http';

export const guestTokenInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

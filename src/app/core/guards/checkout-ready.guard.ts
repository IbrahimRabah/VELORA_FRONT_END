import { CanActivateFn } from '@angular/router';

export const checkoutReadyGuard: CanActivateFn = (route, state) => {
  return true;
};

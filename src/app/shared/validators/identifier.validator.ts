import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { isEgyptianPhone } from './egyptian-phone.validator';

// Light shape check only — the login/register/forgot-password endpoints all accept a
// single `identifier` field that the server decides is a phone or an email; this just
// keeps a visitor from submitting something that's obviously neither.
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function identifierValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value as string | null)?.trim();
    if (!value) {
      return null;
    }
    return EMAIL_SHAPE.test(value) || isEgyptianPhone(value) ? null : { identifier: true };
  };
}

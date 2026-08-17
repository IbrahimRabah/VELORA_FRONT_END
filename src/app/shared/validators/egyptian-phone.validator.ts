import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Accepts the local format the contract examples always use (01012345678 — 11 digits,
// second digit one of 0/1/2/5) and the E.164 form the backend normalizes it to
// (+201012345678). Spaces/dashes are stripped before testing so "010 1234 5678" also
// passes — the backend does the authoritative normalization, this is just a shape check.
const EGYPT_MOBILE_LOCAL = /^01[0125]\d{8}$/;
const EGYPT_MOBILE_INTL = /^(?:\+20|0020)1[0125]\d{8}$/;

export function isEgyptianPhone(value: string): boolean {
  const normalized = value.trim().replace(/[\s-]/g, '');
  return EGYPT_MOBILE_LOCAL.test(normalized) || EGYPT_MOBILE_INTL.test(normalized);
}

export function egyptianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value) {
      return null;
    }
    return isEgyptianPhone(value) ? null : { egyptianPhone: true };
  };
}

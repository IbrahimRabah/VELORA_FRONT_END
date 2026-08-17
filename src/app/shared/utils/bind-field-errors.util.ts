import { FormGroup } from '@angular/forms';

import { FieldError } from '../../core/models';
import { ValidationFailedError } from '../../core/interceptors/error.interceptor';

export function isValidationFailedError(err: unknown): err is ValidationFailedError {
  return typeof err === 'object' && err !== null && (err as { kind?: unknown }).kind === 'VALIDATION_FAILED';
}

// 400 VALIDATION_FAILED field messages come from Bean Validation and are never localized,
// so they're deliberately not shown to the user — the field is just marked invalid
// (`server: true`) and getFieldErrorKey renders a translated generic message instead.
// Fields the backend flagged that don't map to a visible control (e.g. reset-password's
// `token`, which isn't a form field) are returned so the caller can show them elsewhere.
export function bindServerFieldErrors(form: FormGroup, fieldErrors: FieldError[]): FieldError[] {
  const unmatched: FieldError[] = [];
  for (const fieldError of fieldErrors) {
    const control = form.get(fieldError.field);
    if (control) {
      control.setErrors({ server: true });
      control.markAsTouched();
    } else {
      unmatched.push(fieldError);
    }
  }
  return unmatched;
}

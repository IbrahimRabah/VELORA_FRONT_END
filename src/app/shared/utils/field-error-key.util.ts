import { AbstractControl } from '@angular/forms';

// Maps a control's Angular/custom validator errors to a translation key. Shared by every
// auth form so the same error always reads the same way regardless of which field/page
// it's on. Returns null when there's nothing to show yet (untouched, or currently valid).
export function getFieldErrorKey(control: AbstractControl | null): string | null {
  if (!control || !control.errors || !(control.touched || control.dirty)) {
    return null;
  }
  const errors = control.errors;
  if (errors['required']) return 'auth.errors.required';
  if (errors['email']) return 'auth.errors.emailInvalid';
  if (errors['identifier']) return 'auth.errors.identifierInvalid';
  if (errors['egyptianPhone']) return 'auth.errors.phoneInvalid';
  if (errors['minlength']) return 'auth.errors.passwordMinLength';
  if (errors['maxlength']) return 'auth.errors.passwordMaxLength';
  if (errors['weakPassword']) return 'auth.errors.weakPassword';
  if (errors['mismatch']) return 'auth.errors.passwordMismatch';
  if (errors['server']) return 'auth.errors.genericField';
  return 'auth.errors.genericField';
}

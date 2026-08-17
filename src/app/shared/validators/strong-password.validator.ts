import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// 0-5: +1 each for length >= 8, length >= 12, mixed case, a digit, a symbol. The contract
// only requires 8-72 chars (no server-side complexity rule), so this is a soft usability
// nudge, not something that can ever conflict with what the backend will accept.
export function passwordStrengthScore(password: string): number {
  if (!password) {
    return 0;
  }
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
}

// Blocks only passwords that are technically long enough (8+, satisfying the backend) but
// otherwise trivial (e.g. "aaaaaaaa", "12345678") — anything with a second character class
// on top of length already clears the bar.
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string | null;
    if (!value || value.length < 8) {
      return null;
    }
    return passwordStrengthScore(value) >= 2 ? null : { weakPassword: true };
  };
}

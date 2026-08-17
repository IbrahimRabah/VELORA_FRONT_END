import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Group-level validator (attach to the FormGroup, not either control) that mirrors the
// mismatch onto the matching control's own errors, so templates can read
// confirmControl.errors?.['mismatch'] the same way they read any other field error instead
// of digging into the group's errors.
export function matchFieldsValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName);
    const matchingControl = group.get(matchingControlName);
    if (!control || !matchingControl) {
      return null;
    }

    // Don't clobber a validation error the matching control already has for its own sake
    // (e.g. required/minlength) — only manage the 'mismatch' key.
    if (matchingControl.errors && !matchingControl.errors['mismatch']) {
      return null;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ ...matchingControl.errors, mismatch: true });
    } else if (matchingControl.errors) {
      const { mismatch, ...rest } = matchingControl.errors;
      matchingControl.setErrors(Object.keys(rest).length ? rest : null);
    }

    return null;
  };
}

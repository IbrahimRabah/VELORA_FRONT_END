import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function positiveIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

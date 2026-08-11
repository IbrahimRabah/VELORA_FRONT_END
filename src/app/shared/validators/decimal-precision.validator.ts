import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function decimalPrecisionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

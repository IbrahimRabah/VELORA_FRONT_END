import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function identifierValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

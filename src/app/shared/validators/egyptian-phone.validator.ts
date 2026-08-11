import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function egyptianPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    return null;
  };
}

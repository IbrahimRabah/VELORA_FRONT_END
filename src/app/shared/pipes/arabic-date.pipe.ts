import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arabicDate'
})
export class ArabicDatePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

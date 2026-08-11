import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneDisplay'
})
export class PhoneDisplayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

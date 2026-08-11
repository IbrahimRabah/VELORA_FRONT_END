import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localized'
})
export class LocalizedPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

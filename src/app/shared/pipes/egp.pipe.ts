import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'egp'
})
export class EgpPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

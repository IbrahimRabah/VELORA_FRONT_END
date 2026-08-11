import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fulfillmentStatus'
})
export class FulfillmentStatusPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}

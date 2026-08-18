import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderItemResponse } from '../../../../core/models';

@Component({
  selector: 'app-order-items-list',
  templateUrl: './order-items-list.component.html',
  styleUrl: './order-items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemsListComponent {
  @Input({ required: true }) items: OrderItemResponse[] = [];
}

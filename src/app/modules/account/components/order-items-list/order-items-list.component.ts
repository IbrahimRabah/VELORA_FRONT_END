import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-items-list',
  templateUrl: './order-items-list.component.html',
  styleUrl: './order-items-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderItemsListComponent {

}

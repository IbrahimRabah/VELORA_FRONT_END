import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-recent-orders-widget',
  templateUrl: './recent-orders-widget.component.html',
  styleUrl: './recent-orders-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecentOrdersWidgetComponent {

}

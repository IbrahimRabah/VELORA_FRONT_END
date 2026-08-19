import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DashboardLowStockItem } from '../../../../../core/models';

@Component({
  selector: 'app-low-stock-widget',
  templateUrl: './low-stock-widget.component.html',
  styleUrl: './low-stock-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LowStockWidgetComponent {
  @Input({ required: true }) items!: DashboardLowStockItem[];
}

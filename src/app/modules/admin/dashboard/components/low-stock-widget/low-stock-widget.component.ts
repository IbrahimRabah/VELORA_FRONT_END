import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-low-stock-widget',
  templateUrl: './low-stock-widget.component.html',
  styleUrl: './low-stock-widget.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LowStockWidgetComponent {

}

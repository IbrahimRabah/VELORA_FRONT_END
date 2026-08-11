import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-order-timeline',
  templateUrl: './order-timeline.component.html',
  styleUrl: './order-timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderTimelineComponent {

}

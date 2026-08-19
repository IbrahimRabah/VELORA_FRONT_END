import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { DashboardDeliveryHealth } from '../../../../../core/models';

const RADIUS = 40;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const ALARM_BELOW_PERCENT = 80;

@Component({
  selector: 'app-delivery-rate-chart',
  templateUrl: './delivery-rate-chart.component.html',
  styleUrl: './delivery-rate-chart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeliveryRateChartComponent {
  @Input({ required: true }) data!: DashboardDeliveryHealth;

  readonly radius = RADIUS;
  readonly circumference = CIRCUMFERENCE;

  get ratePercent(): number {
    return parseFloat(this.data.successRatePercent) || 0;
  }

  get isAlarm(): boolean {
    return this.ratePercent < ALARM_BELOW_PERCENT;
  }

  get dashOffset(): number {
    return this.circumference * (1 - this.ratePercent / 100);
  }
}

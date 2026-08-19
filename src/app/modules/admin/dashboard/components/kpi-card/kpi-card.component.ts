import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Money, money } from '../../../../../core/models';

// Latin digits regardless of UI language, no currency symbol — the "EGP" code is
// rendered separately (smaller, muted) beside the figure rather than baked into it.
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US-u-nu-latn', {
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrl: './kpi-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KpiCardComponent {
  @Input({ required: true }) titleKey!: string;
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) revenue!: Money;
  @Input({ required: true }) orderCount!: number;

  get formattedRevenue(): string {
    return NUMBER_FORMATTER.format(money(this.revenue));
  }
}

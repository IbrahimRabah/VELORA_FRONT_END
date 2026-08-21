import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { StatusTone } from '../../../core/constants/order-status.constants';

@Component({
  selector: 'app-vl-status-badge',
  templateUrl: './vl-status-badge.component.html',
  styleUrl: './vl-status-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlStatusBadgeComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) tone!: StatusTone;
  // Outline (border + transparent fill) instead of the default tinted-background pill —
  // used to visually distinguish a second status column (e.g. payment) from a fulfilment
  // badge sitting beside it, so the two read as different kinds of status at a glance.
  @Input() outline = false;
}

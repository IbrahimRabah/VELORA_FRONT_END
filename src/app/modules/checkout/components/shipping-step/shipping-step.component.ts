import { ChangeDetectionStrategy, Component } from '@angular/core';

// Scaffolded as "shipping-step" for an earlier multi-step wizard design; this task flattens
// that into one page, so this now renders the "Delivery Method" section (payment-method-selector
// plus the "pay nothing now" reassurance line) rather than a standalone wizard step.
@Component({
  selector: 'app-shipping-step',
  templateUrl: './shipping-step.component.html',
  styleUrl: './shipping-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingStepComponent {}

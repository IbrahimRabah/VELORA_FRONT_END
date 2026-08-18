import { ChangeDetectionStrategy, Component } from '@angular/core';

// Cash on delivery is the only option in V1 — still built as a selector (not static text)
// per the design spec, so V1.5 can add a second radio card for online payment later.
@Component({
  selector: 'app-payment-method-selector',
  templateUrl: './payment-method-selector.component.html',
  styleUrl: './payment-method-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentMethodSelectorComponent {}

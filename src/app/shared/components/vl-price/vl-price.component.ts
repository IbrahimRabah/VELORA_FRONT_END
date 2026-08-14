import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Money, money } from '../../../core/models';

// -u-nu-latn forces Latin digits regardless of UI language (an ar-EG Intl.NumberFormat
// would otherwise render Eastern Arabic numerals), and currencyDisplay: 'code' forces
// the literal "EGP" code instead of the localized "ج.م." symbol — storefront pricing
// uses "EGP" in both languages.
const PRICE_FORMATTER = new Intl.NumberFormat('en-US-u-nu-latn', {
  style: 'currency',
  currency: 'EGP',
  currencyDisplay: 'code',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

@Component({
  selector: 'app-vl-price',
  templateUrl: './vl-price.component.html',
  styleUrl: './vl-price.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlPriceComponent {
  @Input({ required: true }) minPrice!: Money;
  @Input() maxPrice: Money | null = null;

  get formatted(): string {
    return PRICE_FORMATTER.format(money(this.minPrice));
  }

  get isRange(): boolean {
    return this.maxPrice != null && money(this.maxPrice) !== money(this.minPrice);
  }
}

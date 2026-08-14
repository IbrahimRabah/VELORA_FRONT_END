import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductSummaryResponse } from '../../../core/models';

@Component({
  selector: 'app-vl-product-card',
  templateUrl: './vl-product-card.component.html',
  styleUrl: './vl-product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlProductCardComponent {
  @Input({ required: true }) product!: ProductSummaryResponse;
}

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductSummaryResponse } from '../../../../core/models';

@Component({
  selector: 'app-related-products',
  templateUrl: './related-products.component.html',
  styleUrl: './related-products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RelatedProductsComponent {
  @Input() products: ProductSummaryResponse[] = [];
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductSummaryResponse } from '../../../../core/models';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrl: './product-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductGridComponent {
  @Input() products: ProductSummaryResponse[] = [];
  @Input() loading = false;
  @Input() error = false;
  @Input() hasActiveFilters = false;
  @Input() page = 0;
  @Input() totalPages = 0;

  @Output() readonly pageChange = new EventEmitter<number>();
  @Output() readonly retry = new EventEmitter<void>();
  @Output() readonly clearFilters = new EventEmitter<void>();

  readonly skeletonPlaceholders = Array.from({ length: 12 });
}

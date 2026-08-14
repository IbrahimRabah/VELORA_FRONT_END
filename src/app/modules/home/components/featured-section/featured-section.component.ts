import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductSummaryResponse } from '../../../../core/models';

@Component({
  selector: 'app-featured-section',
  templateUrl: './featured-section.component.html',
  styleUrl: './featured-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeaturedSectionComponent {
  @Input() products: ProductSummaryResponse[] = [];
  @Input() loading = false;

  // Placeholder count for the loading grid — not tied to the real page size, just
  // enough to fill the first viewport without layout jumping once real data lands.
  readonly skeletonPlaceholders = Array.from({ length: 9 });

  get showSection(): boolean {
    return this.loading || this.products.length > 0;
  }
}

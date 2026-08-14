import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryNode } from '../../../../core/models';

// The API's own CategoryNode.imageUrl isn't used for this showcase — these three
// slugs get curated local artwork instead. Any category outside this map (or below
// the top level) simply isn't shown here.
const SHOWCASE_IMAGES: Record<string, string> = {
  watches: 'assets/images/categories/watch.png',
  wallets: 'assets/images/categories/wallet.png',
  perfumes: 'assets/images/categories/perfume.png',
};

@Component({
  selector: 'app-category-showcase',
  templateUrl: './category-showcase.component.html',
  styleUrl: './category-showcase.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryShowcaseComponent {
  @Input() categories: CategoryNode[] = [];

  get items(): CategoryNode[] {
    return this.categories.filter((category) => SHOWCASE_IMAGES[category.slug]);
  }

  imageFor(category: CategoryNode): string {
    return SHOWCASE_IMAGES[category.slug];
  }
}

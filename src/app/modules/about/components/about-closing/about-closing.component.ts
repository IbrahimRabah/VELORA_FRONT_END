import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryIds } from '../../models/category-ids';

interface ShopLink {
  key: 'shopWatches' | 'shopWallets' | 'shopPerfumes';
  icon: string;
  categoryKey: keyof CategoryIds;
}

const LINKS: ShopLink[] = [
  { key: 'shopWatches', icon: 'pi-clock', categoryKey: 'watches' },
  { key: 'shopWallets', icon: 'pi-wallet', categoryKey: 'wallets' },
  { key: 'shopPerfumes', icon: 'pi-sparkles', categoryKey: 'perfumes' },
];

@Component({
  selector: 'app-about-closing',
  templateUrl: './about-closing.component.html',
  styleUrl: './about-closing.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutClosingComponent {
  @Input() categoryIds: CategoryIds = { watches: null, wallets: null, perfumes: null };

  readonly links = LINKS;

  queryParamsFor(link: ShopLink): { categoryId: number } | null {
    const id = this.categoryIds[link.categoryKey];
    return id == null ? null : { categoryId: id };
  }
}

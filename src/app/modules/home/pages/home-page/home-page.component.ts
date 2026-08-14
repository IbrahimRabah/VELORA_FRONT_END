import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { CategoryNode, ProductSummaryResponse } from '../../../../core/models';
import { CatalogApiService } from '../../../../core/services/api/catalog-api.service';
import { LanguageStoreService } from '../../../../core/state/language-store.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly languageStore = inject(LanguageStoreService);

  readonly categories = signal<CategoryNode[]>([]);
  readonly featuredProducts = signal<ProductSummaryResponse[]>([]);
  readonly featuredLoading = signal(true);
  readonly newArrivals = signal<ProductSummaryResponse[]>([]);
  readonly newArrivalsLoading = signal(true);

  constructor() {
    // Re-runs on every lang() change (including once immediately): names/descriptions
    // come back server-translated via Accept-Language (language.interceptor), so a
    // language switch needs a fresh fetch, not just a re-render. On error, each signal
    // is left as-is (categories) or just stops loading (products) rather than being
    // cleared, so a transient failure doesn't blank out already-loaded sections.
    effect(() => {
      this.languageStore.lang();

      this.catalogApi.getCategoryTree().subscribe({
        next: (categories) => this.categories.set(categories),
        error: () => {},
      });

      this.featuredLoading.set(true);
      this.catalogApi.getFeatured().subscribe({
        next: (page) => {
          this.featuredProducts.set(page.content);
          this.featuredLoading.set(false);
        },
        error: () => this.featuredLoading.set(false),
      });

      this.newArrivalsLoading.set(true);
      this.catalogApi.getNewArrivals().subscribe({
        next: (page) => {
          this.newArrivals.set(page.content);
          this.newArrivalsLoading.set(false);
        },
        error: () => this.newArrivalsLoading.set(false),
      });
    }, { allowSignalWrites: true });
  }
}

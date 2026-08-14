import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';

import { CategoryNode } from '../../../core/models';
import { CatalogApiService } from '../../../core/services/api/catalog-api.service';
import { LanguageStoreService } from '../../../core/state/language-store.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteHeaderComponent {
  private readonly catalogApi = inject(CatalogApiService);
  private readonly languageStore = inject(LanguageStoreService);

  // Fetched once here rather than in main-nav/mobile-nav-drawer individually — both need
  // the same tree, and it's shown in the DOM at the same time (drawer just starts hidden).
  readonly categories = signal<CategoryNode[]>([]);
  readonly mobileNavOpen = signal(false);

  constructor() {
    // Re-runs whenever lang() changes (including once immediately) — category names come
    // back server-translated via Accept-Language (language.interceptor), so switching the
    // UI language without re-fetching would leave stale-language names in the nav.
    effect(() => {
      this.languageStore.lang();
      // On error, leave `categories` as-is rather than clearing it — a transient re-fetch
      // failure (flaky network, backend hiccup) would otherwise blank the entire nav until
      // the next successful language switch or a manual page refresh, even though the
      // previously-loaded (just now stale-language) categories are still perfectly usable.
      this.catalogApi.getCategoryTree().subscribe({
        next: (categories) => this.categories.set(categories),
        error: () => {},
      });
    }, { allowSignalWrites: true });
  }

  openMobileNav(): void {
    this.mobileNavOpen.set(true);
  }

  onMobileNavVisibleChange(visible: boolean): void {
    this.mobileNavOpen.set(visible);
  }
}

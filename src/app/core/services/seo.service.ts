import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { ProductSeo } from '../models';

/**
 * Title/Meta from Angular's platform-browser work safely during SSR (they operate on
 * the injected DOCUMENT, which platform-server provides) — no isPlatformBrowser guard needed.
 */
@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  applyProductSeo(seo: ProductSeo): void {
    this.title.setTitle(seo.metaTitle);
    this.meta.updateTag({ name: 'description', content: seo.metaDescription });
  }

  reset(defaultTitle: string): void {
    this.title.setTitle(defaultTitle);
    this.meta.removeTag("name='description'");
  }
}

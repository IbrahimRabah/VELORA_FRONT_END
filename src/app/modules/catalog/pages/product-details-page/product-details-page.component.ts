import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs';

import {
  AttributeGroupResponse,
  ImageResponse,
  ProductDetailResponse,
  ProductSummaryResponse,
  VariantResponse,
} from '../../../../core/models';
import { CartApiService } from '../../../../core/services/api/cart-api.service';
import { CatalogApiService } from '../../../../core/services/api/catalog-api.service';
import { ToastService } from '../../../../core/services/toast.service';
import { CartStoreService } from '../../../../core/state/cart-store.service';
import { LanguageStoreService } from '../../../../core/state/language-store.service';

// The only value-level attribute rendered as a swatch on the PDP — the group whose values
// carry a hexColor. Other variant-defining attributes (if any) aren't surfaced here per the
// approved layout, which shows color only.
function findColorGroup(product: ProductDetailResponse): AttributeGroupResponse | null {
  return product.variantOptions.find((group) => group.values.some((value) => value.hexColor != null)) ?? null;
}

function dedupeById(images: ImageResponse[]): ImageResponse[] {
  const seen = new Set<number>();
  return images.filter((image) => (seen.has(image.id) ? false : (seen.add(image.id), true)));
}

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrl: './product-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogApi = inject(CatalogApiService);
  private readonly cartApi = inject(CartApiService);
  private readonly cartStore = inject(CartStoreService);
  private readonly languageStore = inject(LanguageStoreService);
  private readonly toast = inject(ToastService);
  private readonly translate = inject(TranslateService);

  private readonly slug = toSignal(this.route.paramMap.pipe(map((params) => params.get('id'))), {
    initialValue: null,
  });

  readonly product = signal<ProductDetailResponse | null>(null);
  readonly loading = signal(true);
  readonly relatedProducts = signal<ProductSummaryResponse[]>([]);
  readonly selectedValueId = signal<number | null>(null);
  readonly addingToCart = signal(false);

  readonly colorGroup = computed<AttributeGroupResponse | null>(() => {
    const product = this.product();
    return product ? findColorGroup(product) : null;
  });

  readonly selectedVariant = computed<VariantResponse | null>(() => {
    const product = this.product();
    if (!product || !product.variants.length) return null;
    const valueId = this.selectedValueId();
    const match = valueId == null ? undefined : product.variants.find((v) => v.attributeValueIds.includes(valueId));
    return match ?? product.variants[0];
  });

  // Always poster + the selected variant's own shots — never just one or the other. The
  // product-level "poster" (main: true) is pinned first regardless of variant, and variant
  // photos with no images of their own (single-variant products, e.g. perfumes, whose
  // photos all live at product level with only one flagged main) fall back to the full
  // product image set so they keep their existing gallery instead of losing shots.
  readonly galleryImages = computed<ImageResponse[]>(() => {
    const product = this.product();
    if (!product) return [];

    const poster = product.images.find((image) => image.main) ?? product.images[0] ?? null;
    const variant = this.selectedVariant();
    const variantImages = variant?.images.length ? variant.images : product.images;

    return dedupeById(poster ? [poster, ...variantImages] : variantImages);
  });

  // The image the gallery should focus. Plain (not computed) on purpose: it defaults to the
  // poster when a product loads, and only jumps to the color's own shot when the customer
  // explicitly picks one in selectValue() — so landing on the page always shows the poster,
  // and re-selecting the poster's own thumbnail still works via the gallery's own click handling.
  readonly activeGalleryImageId = signal<number | null>(null);

  readonly categoryName = computed(() => {
    const path = this.product()?.categoryPath ?? [];
    return path.length ? path[path.length - 1].name : '';
  });

  readonly displayPrice = computed(() => this.selectedVariant()?.price ?? this.product()?.priceRange.min ?? 0);

  readonly inStock = computed(() => this.selectedVariant()?.inStock ?? this.product()?.inStock ?? false);

  constructor() {
    // Re-fetches on slug change (navigating product-to-product via a related-products card
    // reuses this route's component instance, so a route param subscription is required
    // rather than a one-time constructor read) and on language change (names/descriptions
    // come back server-translated via Accept-Language, same as the home page's pattern).
    effect(() => {
      const slug = this.slug();
      this.languageStore.lang();
      if (!slug) return;

      this.loading.set(true);
      this.catalogApi.getProduct(slug).subscribe({
        next: (product) => {
          this.product.set(product);
          this.selectedValueId.set(this.defaultValueId(product));
          this.activeGalleryImageId.set(this.posterId(product));
          this.loading.set(false);
          this.fetchRelated(product.id);
        },
        error: () => {
          this.product.set(null);
          this.loading.set(false);
        },
      });
    }, { allowSignalWrites: true });
  }

  selectValue(valueId: number): void {
    this.selectedValueId.set(valueId);

    const product = this.product();
    const variant = this.selectedVariant();
    const image = variant?.images.length ? variant.images[0] : null;
    this.activeGalleryImageId.set(image?.id ?? (product ? this.posterId(product) : null));
  }

  addToCart(): void {
    const variant = this.selectedVariant();
    if (!variant || this.addingToCart()) return;

    this.addingToCart.set(true);
    this.cartApi.addItem({ variantId: variant.id, quantity: 1 }).subscribe({
      next: (cart) => {
        this.cartStore.set(cart);
        this.addingToCart.set(false);
        this.toast.success(this.translate.instant('product.addedToCart'));
      },
      error: () => this.addingToCart.set(false),
    });
  }

  private fetchRelated(productId: number): void {
    this.relatedProducts.set([]);
    this.catalogApi.getRelated(productId).subscribe({
      next: (products) => this.relatedProducts.set(products),
      error: () => {},
    });
  }

  private posterId(product: ProductDetailResponse): number | null {
    return (product.images.find((image) => image.main) ?? product.images[0] ?? null)?.id ?? null;
  }

  private defaultValueId(product: ProductDetailResponse): number | null {
    const firstVariant = product.variants[0];
    const colorGroup = findColorGroup(product);
    if (!firstVariant || !colorGroup) return null;
    return colorGroup.values.find((value) => firstVariant.attributeValueIds.includes(value.id))?.id ?? null;
  }
}

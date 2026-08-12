import { Money } from '../common/money';
import { SortOption } from '../../enums/sort-option';
import { AttributeGroupResponse } from './attribute';
import { BrandResponse } from './brand';
import { CategoryBreadcrumbItem } from './category';
import { ImageResponse } from './image';
import { VariantResponse } from './variant';

// GET /products, /products/featured, /products/new-arrivals (content[] items) and
// GET /products/{id}/related (plain array).
export interface ProductSummaryResponse {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  brandName: string;
  categorySlug: string;
  imageUrl: string;
  imageAlt: string;
  minPrice: Money;
  maxPrice: Money;
  // Not shown null in the example (a discounted product is used); a non-discounted
  // product plausibly omits these, but no null example exists in the contract for this
  // response — kept required per the literal example.
  compareAtPrice: Money;
  discountPercent: number;
  inStock: boolean;
  availableQty: number;
  featured: boolean;
  newArrival: boolean;
}

// GET /products/{slug}
export interface ProductDetailResponse {
  id: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  brand: BrandResponse;
  categoryPath: CategoryBreadcrumbItem[];
  priceRange: { min: Money; max: Money };
  variantOptions: AttributeGroupResponse[];
  variants: VariantResponse[];
  specifications: ProductSpecification[];
  images: ImageResponse[];
  inStock: boolean;
  featured: boolean;
  newArrival: boolean;
  seo: ProductSeo;
}

export interface ProductSpecification {
  code: string;
  name: string;
  value: string;
}

export interface ProductSeo {
  metaTitle: string;
  metaDescription: string;
  canonicalPath: string;
}

// Client-side filter model for GET /products — every field optional and composable.
export interface ProductFilter {
  q?: string;
  categoryId?: number;
  brandIds?: number[];
  minPrice?: number;
  maxPrice?: number;
  attributeValueIds?: number[];
  inStockOnly?: boolean;
  featured?: boolean;
  newArrival?: boolean;
  sort?: SortOption;
  page?: number;
  size?: number;
}

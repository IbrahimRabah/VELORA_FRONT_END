import { Money } from '../common/money';
import { ImageResponse } from './image';

// Variant entry inside GET /products/{slug}.variants[].
export interface VariantResponse {
  id: number;
  sku: string;
  summary: string;
  price: Money;
  // Not shown null in the one example available (always has a value there) — kept
  // required per the contract's literal example, though a variant with no discount could
  // plausibly omit it.
  compareAtPrice: Money;
  discountPercent: number;
  attributeValueIds: number[];
  availableQty: number;
  inStock: boolean;
  images: ImageResponse[];
}

// GET /variants/{id}/availability
export interface VariantAvailabilityResponse {
  variantId: number;
  sku: string;
  price: Money;
  availableQty: number;
  inStock: boolean;
  // sellable = ACTIVE, not archived, and in stock — gate add-to-cart on this, not inStock alone.
  sellable: boolean;
}

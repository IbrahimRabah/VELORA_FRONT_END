import { Money } from '../common/money';
import { CartWarning } from '../../enums/cart-warning';

// Named CartWarningEntry (not CartWarning) to avoid colliding with the CartWarning enum
// (core/enums/cart-warning.ts) that names the `code` values below — the build plan's
// table calls this interface "CartWarning" but that name is already taken.
export interface CartWarningEntry {
  code: CartWarning;
  itemId: number;
  sku: string;
  detail: string;
}

export interface CartItemResponse {
  itemId: number;
  variantId: number;
  productId: number;
  slug: string;
  name: string;
  variantSummary: string;
  sku: string;
  imageUrl: string;
  unitPrice: Money;
  priceAtAdd: Money;
  priceChanged: boolean;
  quantity: number;
  qtyAvailable: number;
  inStock: boolean;
  lineTotal: Money;
}

// Returned by every cart mutation (get/add/update/remove/clear/merge) — recalculated
// server-side on every call. Never compute totals client-side from this shape.
export interface CartResponse {
  cartId: number;
  items: CartItemResponse[];
  itemCount: number;
  totalQuantity: number;
  subtotal: Money;
  discountTotal: Money;
  estimatedTotal: Money;
  taxIncluded: Money;
  couponCode: string | null;
  warnings: CartWarningEntry[];
  checkoutReady: boolean;
}

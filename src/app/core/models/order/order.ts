import { Money } from '../common/money';
import { FulfillmentStatus } from '../../enums/fulfillment-status';
import { PaymentStatus } from '../../enums/payment-status';
import { PaymentMethod } from '../../enums/payment-method';

export interface OrderItemResponse {
  id: number;
  variantId: number;
  productId: number;
  productSlug: string;
  name: string;
  sku: string;
  variantSummary: string;
  imageUrl: string;
  unitPrice: Money;
  quantity: number;
  lineDiscount: Money;
  allocatedCartDiscount: Money;
  lineTotal: Money;
  taxAmount: Money;
  quantityReturned: number;
  returnableQuantity: number;
}

// `kind` is "FULFILLMENT" in every example shown; the payment-status endpoint's prose
// says it also "adds a new timeline entry", implying a "PAYMENT" kind exists too, but no
// JSON example shows it — kept as `string`, not a literal union, to avoid guessing the
// exact value. Same reasoning for `from`/`to`: they hold either a FulfillmentStatus or a
// PaymentStatus string depending on `kind`.
export interface OrderTimelineEntry {
  kind: string;
  from: string | null;
  to: string;
  note: string | null;
  at: string;
}

// Snapshot copied onto the order at checkout — never a live reference to the saved
// address. Distinct from AddressResponse: has cityName (AddressResponse doesn't), and
// drops governorateId/id/isDefault/label/altPhone. area/building/floor/apartment/landmark
// are inferred nullable by analogy with the optional fields on the address input.
export interface OrderAddressSnapshot {
  governorateName: string;
  cityName: string;
  area: string | null;
  streetAddress: string;
  building: string | null;
  floor: string | null;
  apartment: string | null;
  landmark: string | null;
  formatted: string;
}

// POST /orders (201), GET /me/orders/{orderNumber}, GET /admin/orders/{orderId}.
export interface OrderResponse {
  id: number;
  orderNumber: string;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  currency: string;
  subtotal: Money;
  discountTotal: Money;
  shippingCost: Money;
  codFee: Money;
  grandTotal: Money;
  taxTotal: Money;
  netTotal: Money;
  contactName: string;
  contactPhone: string;
  contactAltPhone: string | null;
  // Inferred nullable — email is optional on both saved addresses and guest checkout input.
  contactEmail: string | null;
  shippingAddress: OrderAddressSnapshot;
  shippingZoneName: string;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  // Inferred nullable — customerNote is documented optional on checkout.
  customerNote: string | null;
  items: OrderItemResponse[];
  totalQuantity: number;
  timeline: OrderTimelineEntry[];
  // Server-computed — never derive this from fulfillmentStatus client-side.
  cancellable: boolean;
  placedAt: string;
  confirmedAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  // Populated once the invoice is issued at delivery, null before that (verified by the
  // backend with a real order: null while SHIPPED, set once DELIVERED, e.g. "VLR-INV-2026-000031").
  invoiceNumber: string | null;
}

// GET /me/orders, GET /admin/orders — list row.
export interface OrderSummaryResponse {
  id: number;
  orderNumber: string;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  grandTotal: Money;
  itemCount: number;
  totalQuantity: number;
  contactName: string;
  contactPhone: string;
  governorateName: string;
  // Inferred nullable — a product with zero images would have nothing to show here.
  thumbnailUrl: string | null;
  placedAt: string;
}

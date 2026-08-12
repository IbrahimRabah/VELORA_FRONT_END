import { FulfillmentStatus } from '../enums/fulfillment-status';
import { PaymentStatus } from '../enums/payment-status';

// PATCH /admin/orders/{orderId}/fulfillment-status — legal transitions, copied verbatim
// from the contract's transition table. Terminal statuses map to an empty array.
export const FULFILLMENT_TRANSITIONS: Record<FulfillmentStatus, readonly FulfillmentStatus[]> = {
  [FulfillmentStatus.PENDING]: [FulfillmentStatus.CONFIRMED, FulfillmentStatus.CANCELLED],
  [FulfillmentStatus.CONFIRMED]: [FulfillmentStatus.PROCESSING, FulfillmentStatus.CANCELLED],
  [FulfillmentStatus.PROCESSING]: [FulfillmentStatus.SHIPPED, FulfillmentStatus.CANCELLED],
  [FulfillmentStatus.SHIPPED]: [
    FulfillmentStatus.OUT_FOR_DELIVERY,
    FulfillmentStatus.DELIVERY_FAILED,
    FulfillmentStatus.RETURNED_TO_SELLER,
  ],
  [FulfillmentStatus.OUT_FOR_DELIVERY]: [
    FulfillmentStatus.DELIVERED,
    FulfillmentStatus.DELIVERY_FAILED,
    FulfillmentStatus.REFUSED_ON_DELIVERY,
  ],
  [FulfillmentStatus.DELIVERY_FAILED]: [
    FulfillmentStatus.OUT_FOR_DELIVERY,
    FulfillmentStatus.REFUSED_ON_DELIVERY,
    FulfillmentStatus.RETURNED_TO_SELLER,
  ],
  [FulfillmentStatus.REFUSED_ON_DELIVERY]: [FulfillmentStatus.RETURNED_TO_SELLER],
  [FulfillmentStatus.DELIVERED]: [FulfillmentStatus.RETURNED, FulfillmentStatus.PARTIALLY_RETURNED],
  [FulfillmentStatus.PARTIALLY_RETURNED]: [FulfillmentStatus.RETURNED],
  [FulfillmentStatus.CANCELLED]: [],
  [FulfillmentStatus.RETURNED]: [],
  [FulfillmentStatus.RETURNED_TO_SELLER]: [],
};

// PATCH /admin/orders/{orderId}/payment-status — legal transitions, copied verbatim
// from the contract's transition table.
export const PAYMENT_TRANSITIONS: Record<PaymentStatus, readonly PaymentStatus[]> = {
  [PaymentStatus.PENDING]: [PaymentStatus.AUTHORIZED, PaymentStatus.PAID, PaymentStatus.FAILED, PaymentStatus.EXPIRED],
  [PaymentStatus.AUTHORIZED]: [PaymentStatus.PAID, PaymentStatus.FAILED, PaymentStatus.EXPIRED],
  [PaymentStatus.PAID]: [PaymentStatus.PARTIALLY_REFUNDED, PaymentStatus.REFUNDED],
  [PaymentStatus.PARTIALLY_REFUNDED]: [PaymentStatus.REFUNDED],
  [PaymentStatus.FAILED]: [PaymentStatus.PENDING],
  [PaymentStatus.EXPIRED]: [PaymentStatus.PENDING],
  [PaymentStatus.REFUNDED]: [],
};

// `note` is required on PATCH /admin/orders/{orderId}/fulfillment-status when moving to one of these.
export const NOTE_REQUIRED_STATUSES: readonly FulfillmentStatus[] = [
  FulfillmentStatus.DELIVERY_FAILED,
  FulfillmentStatus.REFUSED_ON_DELIVERY,
  FulfillmentStatus.RETURNED_TO_SELLER,
  FulfillmentStatus.CANCELLED,
];

// UI labels — not part of the contract (statuses are plain enum strings there), but
// needed everywhere a status is rendered to a user.
export const FULFILLMENT_STATUS_LABELS_AR: Record<FulfillmentStatus, string> = {
  [FulfillmentStatus.PENDING]: 'بانتظار التأكيد',
  [FulfillmentStatus.CONFIRMED]: 'مؤكد',
  [FulfillmentStatus.PROCESSING]: 'جاري التجهيز',
  [FulfillmentStatus.SHIPPED]: 'تم الشحن',
  [FulfillmentStatus.OUT_FOR_DELIVERY]: 'خارج للتوصيل',
  [FulfillmentStatus.DELIVERED]: 'تم التوصيل',
  [FulfillmentStatus.DELIVERY_FAILED]: 'فشل التوصيل',
  [FulfillmentStatus.REFUSED_ON_DELIVERY]: 'تم الرفض عند الاستلام',
  [FulfillmentStatus.RETURNED_TO_SELLER]: 'تمت الإعادة للبائع',
  [FulfillmentStatus.CANCELLED]: 'ملغي',
  [FulfillmentStatus.RETURNED]: 'مرتجع',
  [FulfillmentStatus.PARTIALLY_RETURNED]: 'مرتجع جزئياً',
};

export const FULFILLMENT_STATUS_LABELS_EN: Record<FulfillmentStatus, string> = {
  [FulfillmentStatus.PENDING]: 'Pending confirmation',
  [FulfillmentStatus.CONFIRMED]: 'Confirmed',
  [FulfillmentStatus.PROCESSING]: 'Processing',
  [FulfillmentStatus.SHIPPED]: 'Shipped',
  [FulfillmentStatus.OUT_FOR_DELIVERY]: 'Out for delivery',
  [FulfillmentStatus.DELIVERED]: 'Delivered',
  [FulfillmentStatus.DELIVERY_FAILED]: 'Delivery failed',
  [FulfillmentStatus.REFUSED_ON_DELIVERY]: 'Refused on delivery',
  [FulfillmentStatus.RETURNED_TO_SELLER]: 'Returned to seller',
  [FulfillmentStatus.CANCELLED]: 'Cancelled',
  [FulfillmentStatus.RETURNED]: 'Returned',
  [FulfillmentStatus.PARTIALLY_RETURNED]: 'Partially returned',
};

export const PAYMENT_STATUS_LABELS_AR: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'قيد الانتظار',
  [PaymentStatus.AUTHORIZED]: 'معتمد',
  [PaymentStatus.PAID]: 'مدفوع',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'مسترد جزئياً',
  [PaymentStatus.REFUNDED]: 'مسترد',
  [PaymentStatus.FAILED]: 'فشل الدفع',
  [PaymentStatus.EXPIRED]: 'منتهي الصلاحية',
};

export const PAYMENT_STATUS_LABELS_EN: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.AUTHORIZED]: 'Authorized',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'Partially refunded',
  [PaymentStatus.REFUNDED]: 'Refunded',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.EXPIRED]: 'Expired',
};

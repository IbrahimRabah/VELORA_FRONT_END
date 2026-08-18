import { FulfillmentStatus } from '../../../core/enums/fulfillment-status';
import { PaymentStatus } from '../../../core/enums/payment-status';

export type PillTone = 'warn' | 'info' | 'ok' | 'stop';

// From the task's design brief. RETURNED/PARTIALLY_RETURNED aren't covered there — no
// returns endpoint exists yet (see AGENT_CONTEXT.md), so they're grouped with the other
// non-successful terminal states rather than left unstyled.
const FULFILLMENT_TONES: Record<FulfillmentStatus, PillTone> = {
  [FulfillmentStatus.PENDING]: 'warn',
  [FulfillmentStatus.CONFIRMED]: 'warn',
  [FulfillmentStatus.PROCESSING]: 'info',
  [FulfillmentStatus.SHIPPED]: 'info',
  [FulfillmentStatus.OUT_FOR_DELIVERY]: 'info',
  [FulfillmentStatus.DELIVERED]: 'ok',
  [FulfillmentStatus.DELIVERY_FAILED]: 'stop',
  [FulfillmentStatus.REFUSED_ON_DELIVERY]: 'stop',
  [FulfillmentStatus.RETURNED_TO_SELLER]: 'stop',
  [FulfillmentStatus.CANCELLED]: 'stop',
  [FulfillmentStatus.RETURNED]: 'stop',
  [FulfillmentStatus.PARTIALLY_RETURNED]: 'stop',
};

// Not specified in the design brief (only fulfillment pill colours were given) — this
// mapping is a UI-only convention established here, following the same warn/info/ok/stop
// semantics: PENDING/PARTIALLY_REFUNDED read as "in between", AUTHORIZED/REFUNDED as
// "processed but not settled", PAID as success, FAILED/EXPIRED as a stop.
const PAYMENT_TONES: Record<PaymentStatus, PillTone> = {
  [PaymentStatus.PENDING]: 'warn',
  [PaymentStatus.PARTIALLY_REFUNDED]: 'warn',
  [PaymentStatus.AUTHORIZED]: 'info',
  [PaymentStatus.REFUNDED]: 'info',
  [PaymentStatus.PAID]: 'ok',
  [PaymentStatus.FAILED]: 'stop',
  [PaymentStatus.EXPIRED]: 'stop',
};

export function fulfillmentPillTone(status: FulfillmentStatus): PillTone {
  return FULFILLMENT_TONES[status];
}

export function paymentPillTone(status: PaymentStatus): PillTone {
  return PAYMENT_TONES[status];
}

import { Language } from '../../../core/enums/language';
import { FulfillmentStatus } from '../../../core/enums/fulfillment-status';
import { PaymentStatus } from '../../../core/enums/payment-status';
import {
  FULFILLMENT_STATUS_LABELS_AR,
  FULFILLMENT_STATUS_LABELS_EN,
  PAYMENT_STATUS_LABELS_AR,
  PAYMENT_STATUS_LABELS_EN,
} from '../../../core/constants/order-status.constants';

export function fulfillmentStatusLabel(status: FulfillmentStatus, lang: Language): string {
  const table = lang === Language.EN ? FULFILLMENT_STATUS_LABELS_EN : FULFILLMENT_STATUS_LABELS_AR;
  return table[status];
}

export function paymentStatusLabel(status: PaymentStatus, lang: Language): string {
  const table = lang === Language.EN ? PAYMENT_STATUS_LABELS_EN : PAYMENT_STATUS_LABELS_AR;
  return table[status];
}

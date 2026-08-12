import { FulfillmentStatus } from '../../enums/fulfillment-status';
import { PaymentStatus } from '../../enums/payment-status';

// Shared query filter for GET /admin/exports/orders/accounting and .../picking-list.
export interface OrderExportFilter {
  dateFrom?: string;
  dateTo?: string;
  fulfillmentStatus?: FulfillmentStatus;
  paymentStatus?: PaymentStatus;
  governorateId?: number;
  excludeCancelled?: boolean;
}

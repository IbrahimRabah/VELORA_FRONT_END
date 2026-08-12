import { FulfillmentStatus } from '../../enums/fulfillment-status';

// POST /me/orders/{orderNumber}/cancel and POST /admin/orders/{orderId}/cancel — same body shape.
export interface CancelOrderRequest {
  reason?: string;
}

// PATCH /admin/orders/{orderId}/fulfillment-status — `note` is required (enforced by the
// caller, not the type system) when `status` is one of NOTE_REQUIRED_STATUSES.
export interface UpdateFulfillmentRequest {
  status: FulfillmentStatus;
  note?: string;
}

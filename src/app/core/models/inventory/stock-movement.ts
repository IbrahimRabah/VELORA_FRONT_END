import { StockMovement } from '../../enums/stock-movement';

// GET /admin/inventory/movements — append-only ledger entry.
export interface StockMovementResponse {
  id: number;
  variantId: number;
  sku: string;
  movementType: StockMovement;
  quantityDelta: number;
  qtyAfter: number;
  // TODO: not in contract — only "ADJUSTMENT" is shown; other values (e.g. "ORDER") are
  // implied by referenceId existing but never enumerated.
  referenceType: string;
  referenceId: number | null;
  reason: string;
  // Inferred nullable — order-flow-driven movements (SALE, RETURN_*) have no human actor.
  actorId: number | null;
  createdAt: string;
}

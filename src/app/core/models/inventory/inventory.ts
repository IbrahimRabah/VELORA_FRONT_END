import { StockMovement } from '../../enums/stock-movement';

// GET /admin/inventory/{variantId}, and the response shape returned by receive/adjust too.
export interface StockPositionResponse {
  variantId: number;
  sku: string;
  productName: string;
  variantSummary: string;
  qtyOnHand: number;
  qtyReserved: number;
  qtyAvailable: number;
  minStockLevel: number;
  lowStock: boolean;
  outOfStock: boolean;
  updatedAt: string;
}

// POST /admin/inventory/{variantId}/receive
export interface ReceiveStockRequest {
  quantity: number;
  reference?: string;
  note?: string;
}

// POST /admin/inventory/{variantId}/adjust — movementType must be one of
// MANUAL_MOVEMENT_TYPES (core/enums/stock-movement.ts), enforced by the caller.
export interface AdjustStockRequest {
  quantityDelta: number;
  reason: string;
  movementType?: StockMovement;
}

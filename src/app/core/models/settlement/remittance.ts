import { Money } from '../common/money';
import { RemittanceStatus } from '../../enums/remittance-status';

export interface OutstandingRemittanceOrder {
  orderId: number;
  orderNumber: string;
  customerName: string;
  governorate: string;
  amount: Money;
  deliveredAt: string;
  daysWaiting: number;
}

// GET /admin/remittances/outstanding
export interface OutstandingRemittanceResponse {
  orderCount: number;
  totalAmount: Money;
  orders: OutstandingRemittanceOrder[];
}

// POST /admin/remittances — note required whenever receivedAmount differs from the sum
// of the covered orders' totals (enforced by the caller, not the type system).
export interface CreateRemittanceRequest {
  courierName: string;
  courierReference?: string;
  settlementDate: string;
  orderIds: number[];
  receivedAmount: Money;
  note?: string;
}

export interface RemittanceOrderLine {
  orderId: number;
  orderNumber: string;
  amount: Money;
}

export interface RemittanceResponse {
  id: number;
  reference: string;
  courierName: string;
  // Inferred nullable — optional on create.
  courierReference: string | null;
  settlementDate: string;
  status: RemittanceStatus;
  expectedAmount: Money;
  receivedAmount: Money;
  difference: Money;
  orderCount: number;
  // Inferred nullable — only required on create when amounts mismatch.
  note: string | null;
  orders: RemittanceOrderLine[];
  createdAt: string;
}

import { Money } from '../common/money';
import { InvoiceStatus } from '../../enums/invoice-status';

// GET /admin/invoices, GET /admin/invoices/{id} — cancelReason is explicitly null in the example.
export interface InvoiceResponse {
  id: number;
  invoiceNumber: string;
  status: InvoiceStatus;
  orderId: number;
  orderNumber: string;
  buyerName: string;
  buyerPhone: string;
  grandTotal: Money;
  taxTotal: Money;
  netTotal: Money;
  currency: string;
  pdfUrl: string;
  issuedAt: string;
  cancelReason: string | null;
}

// POST /admin/invoices/{invoiceId}/cancel
export interface CancelInvoiceRequest {
  reason: string;
}

// GET /admin/invoices/reconciliation/uninvoiced
export interface UninvoicedReport {
  count: number;
  orderIds: number[];
}

import { Money } from '../common/money';
import { FulfillmentStatus } from '../../enums/fulfillment-status';
import { PaymentStatus } from '../../enums/payment-status';
import { Language } from '../../enums/language';

// GET /admin/customers — list row. `status` only ever shows "ACTIVE" in the contract;
// 403 ACCOUNT_SUSPENDED strongly implies a "SUSPENDED" value exists too, but it's never
// shown on this field, so it stays a plain string rather than a guessed union.
export interface CustomerSummaryResponse {
  id: number;
  name: string;
  phone: string;
  // Inferred nullable — registration allows phone-only accounts with no email.
  email: string | null;
  phoneVerified: boolean;
  orderCount: number;
  totalSpent: Money;
  // Inferred nullable — a customer with orderCount: 0 has no last order.
  lastOrderAt: string | null;
  registeredAt: string;
  status: string;
}

export interface CustomerPurchaseStats {
  totalOrders: number;
  deliveredOrders: number;
  // The number that feeds the failed-orders-warning widget.
  failedOrders: number;
  cancelledOrders: number;
  totalSpent: Money;
  averageOrderValue: Money;
  firstOrderAt: string | null;
  lastOrderAt: string | null;
}

// Distinct from AddressResponse — a slimmed-down read model for the customer detail page.
export interface CustomerAddressSummary {
  id: number;
  label: string;
  recipientName: string;
  phone: string;
  governorate: string;
  formatted: string;
  isDefault: boolean;
}

export interface CustomerRecentOrder {
  id: number;
  orderNumber: string;
  fulfillmentStatus: FulfillmentStatus;
  paymentStatus: PaymentStatus;
  grandTotal: Money;
  itemCount: number;
  placedAt: string;
}

// GET /admin/customers/{customerId}
export interface CustomerDetailResponse {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  status: string;
  locale: Language;
  registeredAt: string;
  // Inferred nullable — a customer who never logged in has no lastLoginAt.
  lastLoginAt: string | null;
  roles: string[];
  purchases: CustomerPurchaseStats;
  addresses: CustomerAddressSummary[];
  recentOrders: CustomerRecentOrder[];
}

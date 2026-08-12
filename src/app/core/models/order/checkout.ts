import { PaymentMethod } from '../../enums/payment-method';

// Inline address for guest checkout (or a signed-in customer bypassing a saved address).
export interface CheckoutAddressInput {
  recipientName: string;
  phone: string;
  altPhone?: string;
  // Guest order confirmation only.
  email?: string;
  governorateId: number;
  area?: string;
  streetAddress: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
}

// POST /orders — supply either addressId (signed-in) or address (required for guests),
// never both.
export interface PlaceOrderRequest {
  addressId?: number;
  address?: CheckoutAddressInput;
  paymentMethod?: PaymentMethod;
  customerNote?: string;
}

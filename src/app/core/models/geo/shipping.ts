import { Money } from '../common/money';

// POST /shipping/quote
export interface ShippingQuoteRequest {
  governorateId: number;
  cartId?: number;
}

export interface ShippingQuoteResponse {
  governorateId: number;
  governorateName: string;
  zoneName: string;
  shippingCost: Money;
  baseCost: Money;
  codFee: Money;
  freeShippingApplied: boolean;
  freeShippingThreshold: Money;
  amountToFreeShipping: Money;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  orderSubtotal: Money;
  totalWeightGrams: number;
  estimatedTotal: Money;
}

// GET /admin/shipping/zones — baseCost/freeShippingOver/codFee are explicitly null when
// the zone has no active rate yet (deliveryDaysMin/Max fall back to 0, not null).
export interface ShippingZoneResponse {
  zoneId: number;
  code: string;
  nameAr: string;
  nameEn: string;
  baseCost: Money | null;
  freeShippingOver: Money | null;
  codFee: Money | null;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  active: boolean;
  governorates: string[];
}

// PUT /admin/shipping/rates — replaces the zone's existing active rate.
export interface ShippingRateRequest {
  zoneId: number;
  baseCost: Money;
  maxWeightGrams?: number | null;
  costPerExtraKg?: Money;
  freeShippingOver?: Money;
  codFee?: Money;
  deliveryDaysMin?: number;
  deliveryDaysMax?: number;
}

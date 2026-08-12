import { Money } from '../common/money';

// GET /geo/governorates — unserved governorates are still returned (served: false) with
// zoneName/shippingCost/deliveryDaysMin/deliveryDaysMax explicitly null, per the example.
export interface GovernorateResponse {
  id: number;
  code: string;
  name: string;
  zoneName: string | null;
  shippingCost: Money | null;
  deliveryDaysMin: number | null;
  deliveryDaysMax: number | null;
  served: boolean;
}

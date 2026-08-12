// Cash on delivery is the only payment method in V1 — POST /orders rejects anything
// else with 409 PAYMENT_METHOD_UNAVAILABLE.
export enum PaymentMethod {
  COD = 'COD',
}

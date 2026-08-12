export enum CartWarning {
  // The only code literally shown in a contract JSON example. The other three are named
  // after the blocking cases described in prose ("out of stock / unavailable / quantity
  // reduced") — TODO: not spelled out verbatim in the contract, confirm exact strings against
  // the backend enum.
  PRICE_CHANGED = 'PRICE_CHANGED',
  QUANTITY_REDUCED = 'QUANTITY_REDUCED',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  PRODUCT_UNAVAILABLE = 'PRODUCT_UNAVAILABLE',
}

// checkoutReady is false when any of these is present; PRICE_CHANGED is informational only.
export const BLOCKING_CART_WARNINGS: readonly CartWarning[] = [
  CartWarning.QUANTITY_REDUCED,
  CartWarning.OUT_OF_STOCK,
  CartWarning.PRODUCT_UNAVAILABLE,
];

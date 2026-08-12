// Every amount in the API contract is DECIMAL(19,4) server-side, serialized as either
// a JSON string (most responses) or a JSON number (some admin endpoints) — never trust the shape.
export type Money = string | number;

export const money = (value: Money | null | undefined): number =>
  value == null ? 0 : typeof value === 'number' ? value : parseFloat(value);

export const formatMoney = (
  value: Money | null | undefined,
  locale = 'ar-EG',
  currency = 'EGP',
): string => new Intl.NumberFormat(locale, { style: 'currency', currency }).format(money(value));

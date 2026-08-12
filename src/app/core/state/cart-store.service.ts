import { Injectable, computed, signal } from '@angular/core';

import { BLOCKING_CART_WARNINGS, CartWarning } from '../enums/cart-warning';
import { CartResponse, CartWarningEntry } from '../models';

/**
 * set() is the ONLY way to update this store — no HTTP calls in here. Every cart mutation
 * (get/add/update/remove/clear/merge) returns a complete, freshly-recalculated
 * CartResponse; the calling component/service hands that response straight to set().
 *
 * STRICT RULE: never compute a money total in this store, and never apply an optimistic
 * local update (e.g. bumping quantity locally before the server responds). The contract
 * is explicit that the cart is recalculated server-side on every call — this store only
 * ever mirrors the last CartResponse it was given, verbatim.
 */
@Injectable({
  providedIn: 'root',
})
export class CartStoreService {
  private readonly _cart = signal<CartResponse | null>(null);

  readonly cart = this._cart.asReadonly();

  readonly itemCount = computed(() => this._cart()?.itemCount ?? 0);
  readonly totalQuantity = computed(() => this._cart()?.totalQuantity ?? 0);
  readonly checkoutReady = computed(() => this._cart()?.checkoutReady ?? false);
  readonly isEmpty = computed(() => this.itemCount() === 0);

  // Filtered to the warning codes that actually block checkout, so the UI can highlight
  // the offending line — not just disable the checkout button.
  readonly blockingWarnings = computed<CartWarningEntry[]>(() =>
    (this._cart()?.warnings ?? []).filter((warning) => BLOCKING_CART_WARNINGS.includes(warning.code)),
  );

  // PRICE_CHANGED is informational only (not in BLOCKING_CART_WARNINGS) — surfaced
  // separately so the UI can show a non-blocking "price changed" notice.
  readonly hasPriceChange = computed(() =>
    (this._cart()?.warnings ?? []).some((warning) => warning.code === CartWarning.PRICE_CHANGED),
  );

  set(cart: CartResponse): void {
    this._cart.set(cart);
  }
}

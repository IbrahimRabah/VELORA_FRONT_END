// POST /cart/items
export interface AddCartItemRequest {
  variantId: number;
  quantity: number;
}

// PATCH /cart/items/{itemId}
export interface UpdateCartItemRequest {
  quantity: number;
}

// POST /cart/merge
export interface MergeCartRequest {
  guestToken: string;
}

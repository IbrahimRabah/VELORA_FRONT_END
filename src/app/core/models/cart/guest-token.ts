// POST /cart/guest-token — server-issued, signed token; never generate this UUID client-side.
export interface GuestTokenResponse {
  guestToken: string;
}

import { API_ROUTES } from '../constants/api-routes';

// Shared by auth.interceptor (to recognize and step aside from case 4) and
// guest-token.interceptor (to decide where X-Guest-Token applies) so the two can never
// disagree about which requests are "guest cart" scope. Per the contract: /cart/** (all
// verbs), POST /orders (checkout), and POST /shipping/quote — NOT /me/orders or
// /admin/orders, which look similar but are a different scope entirely.
const GUEST_SCOPE_EXACT_URLS: readonly string[] = [API_ROUTES.orders.place(), API_ROUTES.shipping.quote()];

export function isGuestTokenScopeUrl(url: string): boolean {
  return url.startsWith(API_ROUTES.cart.cart()) || GUEST_SCOPE_EXACT_URLS.includes(url);
}

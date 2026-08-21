# VELORA — Agent Context

Egyptian e-commerce store for watches, wallets, and perfumes.
Frontend: Angular 17.3, NgModule-based (NOT standalone), with SSR.

## Current state

The entire foundation layer is complete:
- 98 API service methods (all contract endpoints covered, verified 1:1)
- Models, enums, constants, translated error messages (AR + EN)
- 5 HTTP interceptors (auth with single-flight refresh, guest-token,
  language, error, loading)
- 4 signal stores (auth, cart, language, ui)
- 5 functional guards + APP_INITIALIZER
- Design system: PrimeNG 18 + Aura preset bound to VELORA tokens
- Layout shell: header, nav with category dropdowns, expandable search,
  footer
- Home page: hero, features bar, category showcase, featured, new arrivals
- Product details page

Component scaffolding exists for the whole app (161 components,
23 modules) — most files are still empty.

## Reference documents (in docs/)

- `__VELORA_API_Contract_last.txt` — the API contract. This is the ONLY
  source of truth for endpoints, request shapes, and response shapes.
- `VELORA_SERVICES_MODELS_PLAN_AR.md` — the build plan.
- `BACKEND_NOTES.md` — known backend issues and requested changes.

## Stack

- PrimeNG 18 for components (theme configured in
  `core/theme/velora-preset.ts`)
- Bootstrap for layout ONLY — grid, containers, utilities. Its
  conflicting styles (buttons, forms, cards) are excluded in
  `src/_bootstrap-layout.scss`
- ngx-translate 16 for UI strings
- Design tokens in `src/styles/_tokens.scss`

## Hard rules

1. Never invent endpoints or response fields. The contract is
   authoritative. If something seems missing, write
   `// TODO: not in contract` and tell me — do not guess.
2. No `any`.
3. Never touch `localStorage`, `window`, or `document` without an
   `isPlatformBrowser` check. SSR is enabled and guards/initializers do
   run on the server.
4. Colors, spacing, fonts, radii, shadows come from `_tokens.scss` only,
   as `var(--...)`. No hardcoded values.
5. Logical properties only: `margin-inline-start`, `padding-inline`,
   `inset-inline`, `text-align: start`. Never `left`/`right` — direction
   flips at runtime between RTL and LTR.
6. Mobile-first. Start at 375px and scale up. Responsive behaviour on
   phones is a hard requirement, not a nice-to-have.
7. No user-facing text hardcoded in templates. Everything goes through
   translation keys.
8. Components come from PrimeNG. Bootstrap is layout only.
9. Animations 200–300ms, and must respect `prefers-reduced-motion`.
10. `ng build` must pass before you report done. For anything visual,
    also verify in a real browser — Arabic, English, and 375px. Visual
    bugs do not show up in a build.
11. The API omits null fields from every JSON response entirely — a
    `T | null` field with no value never arrives as `"field": null`, the
    key is simply absent, so at runtime it's `undefined`, not `null`.
    This is a global backend convention, not specific to one endpoint.
    Model types still declare these fields `T | null` (don't change
    that) — but never assume a nullable field on a response object is
    present at all. Concretely:
    - Read nullable response fields with `??`/`?.`, or loose `== null`/
      `!= null` — never strict `=== null`/`!== null` (that misses the
      absent/`undefined` case).
    - When populating a form from a response (`patchValue`, `reset`,
      manual field assignment), default every optional field to `''`
      (or the field's empty equivalent) via `?? ''` — never assume the
      key exists.
    - When building a request body to send back, include every field
      the endpoint expects with an explicit value (`''`/`false`/etc.),
      never leave one `undefined` — an omitted key can wipe a
      previously-saved value server-side on a full-replace endpoint.

## Features deliberately NOT in this system

Do not build UI for these — there are no endpoints and promising them
misleads customers:

- Wishlist / favourites (deferred to V1.5)
- Product reviews and ratings (deferred to V1.5)
- Returns (deferred — do not write "30-day returns")
- Free shipping (shipping is 70 or 100 EGP by governorate)
- Shipment tracking with the courier
- Online payment or "Buy Now" — cash on delivery only, and checkout
  goes through the cart because purchases happen at the variant level

Correct alternatives: "Cash on Delivery", "Delivery to all
governorates", "Free cancellation before shipping", "Authentic
products", "My Orders".
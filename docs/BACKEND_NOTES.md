# Backend Notes

Known gaps between the frontend and the current API contract, and requested
backend changes. Not authoritative — the API contract
(`__VELORA_API_Contract_last.txt`) always wins on what the backend actually
does today.

1. **`ProductSummaryResponse` has no secondary/hover image.** The product
   card (`vl-product-card`) is ready to crossfade to a `hoverImageUrl` on
   hover/focus (markup + CSS already in place, commented out) as soon as the
   field exists on `GET /products` (and `/products/featured`,
   `/products/new-arrivals`, `/products/{id}/related`).

2. **Category banner/new-arrivals images are bound to fixed frontend slugs,
   not served by the API.** `CategoryDetailResponse.bannerUrl` exists on the
   contract but isn't used — the product listing page (`/products`) instead
   builds a local asset path client-side from the category's own slug:
   `assets/images/products/{parentSlug}/{scopeSlug}/banner.png` (and
   `new-arrivals.png` for the promo banner), where `parentSlug` is the
   top-level category's slug and `scopeSlug` is the child's slug or
   `all-{parentSlug}` for the parent/no-category view. A category added from
   the admin panel will render with no banner (hidden gracefully, never a
   broken `<img>`) until a matching image folder is added under
   `src/assets/images/products/` and the app is rebuilt. The proper fix is to
   actually serve `bannerUrl`/`imageUrl` from the category record — the
   backend already returns these fields, the frontend just isn't using them
   for this page yet, by design, until image management moves server-side.

3. **No per-category product count endpoint.** The product listing page's
   "Category" filter (radio rows with a count) and the child-category strip
   need a product count per category. Neither `GET /categories/tree` nor
   `GET /categories/{slug}` returns one, so the frontend derives it by firing
   one `GET /products?categoryId={id}&size=1` per candidate category and
   reading `totalElements`. This works but costs N extra requests per page
   load (N = number of sibling/child categories, typically 2-4). A
   `productCount` field on `CategoryNode`/`CategoryDetailResponse.children`
   would remove the need for this entirely.

4. **`GET /categories/filters` duplicates every attribute value (and, on the
   evidence so far, only attribute values — `brands` was clean).** Diagnosed
   by calling the endpoint directly: each `AttributeGroupResponse.values` row
   comes back repeated with an **identical `id`** (confirmed on a store with
   no `categoryId` filter — COLOR's `id: 1 "GOLD"` appeared 4 times, `id: 2
   "SILVER"` 4 times, etc., and the same 4x pattern showed on STRAP_TYPE and
   SIZE_ML too). This is not a data-entry problem (no distinct ids/colours
   were created) — it's the same cartesian-product-from-a-join-without-
   `DISTINCT` bug already fixed once for product images, just recurring on
   this endpoint. The multiplier (4x) lines up with the number of products
   sharing that attribute value in the test data, which points at a join
   against the product/variant table that never got deduped.
   Frontend workaround: `CatalogApiService.getFilters()`
   (`core/services/api/catalog-api.service.ts`) now dedupes `brands` and
   every attribute group's `values` by `id` before the facets reach the UI.
   This is a client-side patch, not a fix — the backend should add
   `DISTINCT` (or an equivalent dedupe) to whatever join produces this
   response.

5. **STRAP_TYPE filtering (`attributeValueIds` = 53/54/55, "Metal / Leather /
   Smart") always returns zero products, on every category.** Diagnosed by
   calling the endpoint directly: `GET /products?categoryId=10250&
   attributeValueIds=53` (Metal, on Watches, which definitely has metal-strap
   products) returns `"totalElements": 0`. Same result for 54 and 55, with or
   without a category filter. This is **not** a frontend bug — the same
   `attributeValueIds` filter works correctly for COLOR (`attributeValueIds=4`
   "Black" on Watches correctly returns 4 matching products) and for SIZE_ML
   on perfumes. The difference: pulling a product's own detail
   (`GET /products/velora-chrono-classic`, a men's watch whose
   `shortDescription` literally says "سوار معدني" / metal strap) shows its
   `variantOptions` only lists a `COLOR` group — no `STRAP_TYPE` group at all,
   and every variant's `attributeValueIds` only contains COLOR ids. So no
   product variant in the current data actually has a STRAP_TYPE value
   attached, even though STRAP_TYPE is exposed as a filterable facet on
   `GET /categories/filters`. There's no reasonable frontend workaround for
   this (unlike item 4, deduping can't invent an association that doesn't
   exist) — the fix is on the backend/data side: either backfill STRAP_TYPE
   attribute-value links onto the existing variants, or stop surfacing
   STRAP_TYPE as a filter facet until they exist.

6. **RESOLVED — `ProductAdminResponse` now returns `translations[]`.** Previously
   `GET`/`PUT /admin/products/{id}` only returned `nameAr`/`nameEn`, with no
   `shortDescription`/`description`/`metaTitle`/`metaDescription` per locale —
   editing an existing product's name risked silently wiping those fields on
   save, since `PUT` fully replaces the translation set. The backend now
   returns `translations[]` on the response, one object per locale, in the
   same shape as the request (`locale`, `name`, `shortDescription`,
   `description`, `metaTitle`, `metaDescription`). `product-form-page` reads
   it directly with no reshaping; the read-only-field warning that used to
   sit above the Details tab's language panels has been removed.

   **Standing constraint — this is a full replace, not a patch.** Two rules
   apply globally, not just to this endpoint:
   - Null fields are **omitted from the response JSON entirely** — a field
     with no value is a missing key, never an explicit `null`. Treat a
     missing key as `''` when populating a form; it is not an error or a
     schema gap.
   - `PUT` replaces each locale's translation object wholesale. Every save
     must send all six fields for every locale present, including ones the
     operator never touched — anything omitted is wiped to `null` server-side.
     `product-form-page.buildRequest()` always sends all six keys (defaulting
     blanks to `''`, never omitting a key) for exactly this reason.

7. **Invoice number missing from `OrderResponse`.** Problem: customers cannot
   download their invoice. `GET /me/invoices/{invoiceNumber}/pdf` exists, but
   there is no way for a customer to discover their invoice number — no field
   on `OrderResponse` and no endpoint that returns it. Requested: add a
   nullable `invoiceNumber` to `OrderResponse`, populated when the invoice is
   issued at delivery and `null` before that. Impact: the invoice download
   feature is entirely unreachable from the customer UI, even though the
   endpoint works. Frontend note: `order-details-page` deliberately never
   renders the Invoice section as a result — `invoice-download-button` is
   built and functional (takes `invoiceNumber` as an `@Input`) but has no
   current caller.

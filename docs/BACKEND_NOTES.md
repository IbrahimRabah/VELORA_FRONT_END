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

3. **RESOLVED — `productCount` added to `CategoryNode`.** The product listing
   page's "Category" filter (radio rows with a count) and the child-category
   strip used to derive counts by firing one `GET /products?categoryId={id}&
   size=1` per candidate category and reading `totalElements` (N extra
   requests per page load, N = sibling/child count, typically 2-4). Categories
   now return `productCount` directly, so `product-list-page` reads
   `node.productCount` and the whole `categoryCounts`/`loadCategoryCounts()`
   workaround (signal, effect, `forkJoin` fan-out) has been removed.
   Field-name note: at the time this was wired, the local contract snapshot
   (`__VELORA_API_Contract_last.txt`) still showed no `productCount` on
   `CategoryNode`/`CategoryDetailResponse` in its example JSON — only on
   attribute values (`/products/{slug}` `variantOptions`, `/categories/filters`
   facets). Wired under the assumption the backend used the same field name
   already established for that analogous case, since that's also the exact
   name this doc requested. Worth a quick contract-doc refresh so this isn't
   re-flagged next audit.

4. **RESOLVED — `GET /categories/filters` no longer duplicates attribute
   values.** Previously every `AttributeGroupResponse.values` row came back
   repeated with an identical `id` (a cartesian-product-from-a-join-without-
   `DISTINCT` bug). Confirmed fixed. The client-side dedupe added as a
   workaround (`CatalogApiService.getFilters()` deduping `brands` and every
   attribute group's `values` by `id`) is now redundant but left in place as
   a harmless safety net — a no-op against a clean response, cheap insurance
   if the bug ever regresses.

5. **RESOLVED — STRAP_TYPE filtering works.** Root cause was deeper than
   first diagnosed: STRAP_TYPE is a specification attribute (not
   variant-defining), stored on `product_attribute_value`, but the filter
   query only searched the variant table — so no variant ever matched
   regardless of data. Both the filter (`GET /products?attributeValueIds=`)
   and the facet (`GET /categories/filters`) are fixed.

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

7. **RESOLVED — `invoiceNumber` added to `OrderResponse`.** Verified by the
   backend with a real order: `null` while `SHIPPED`, populated once
   `DELIVERED` (e.g. `"VLR-INV-2026-000031"`). `order-details-page`
   (customer-facing) now renders the Invoice section — `<app-invoice-
   download-button>` — only `*ngIf="o.invoiceNumber"`, so it stays hidden
   until an invoice actually exists; the button component itself was already
   built and functional, it just had no caller before this.

8. **Attributes not scoped to categories — deferred, not a bug.** No change:
   `GET /admin/attributes` still returns every variant-defining attribute
   regardless of product, so an operator generating variants for a watch is
   offered perfume volumes and vice versa (nonsensical SKUs like a 100ml
   watch remain possible). Confirmed there is no Attribute↔Category link
   anywhere in the schema — adding one is a data-modeling decision being
   deferred deliberately, not an oversight. The obvious-looking quick fix
   (only offer attributes that already have data in that category) was
   considered and rejected: it has a fatal cold-start problem — the first
   product ever added to a new category would find zero attributes on offer,
   since none exist there yet. Frontend workaround stays as-is until a real
   link exists: `product-variants-tab`'s "Add variants" picker groups values
   by attribute with clear headings and shows a `--warn`-tinted note telling
   the operator to select only what actually applies — no client-side
   guessing at which attribute belongs to which category.

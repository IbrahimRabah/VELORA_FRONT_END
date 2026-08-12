import { BrandResponse } from './brand';

// Storefront attribute shapes — single translated `name`, distinct from the admin
// AttributeAdminResponse (separate nameAr/nameEn + variantDefining/filterable). Do not
// reuse between the two; see attribute-admin.ts.
export interface AttributeValueResponse {
  id: number;
  code: string;
  name: string;
  // Only meaningful for color-type values; not shown null in an example but no non-color
  // value example exists either — inferred nullable.
  hexColor: string | null;
  // Confirmed nullable: GET /products/{slug} variantOptions example shows productCount: null;
  // GET /categories/filters shows real counts (34, 21).
  productCount: number | null;
}

export interface AttributeGroupResponse {
  attributeId: number;
  code: string;
  name: string;
  values: AttributeValueResponse[];
}

// GET /categories/filters — minPrice/maxPrice are documented as always null (not
// implemented server-side yet), confirmed by the example.
export interface FilterFacetsResponse {
  brands: BrandResponse[];
  attributes: AttributeGroupResponse[];
  minPrice: number | null;
  maxPrice: number | null;
}

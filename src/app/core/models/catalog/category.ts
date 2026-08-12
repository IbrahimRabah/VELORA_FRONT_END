// Shared by ProductDetailResponse.categoryPath and CategoryDetailResponse.breadcrumb.
export interface CategoryBreadcrumbItem {
  id: number;
  slug: string;
  name: string;
}

// GET /categories/tree (and its admin equivalent) — recursive.
// imageUrl/bannerUrl confirmed nullable by the admin tree example
// ("discontinued-line" -> imageUrl: null, bannerUrl: null).
export interface CategoryNode {
  id: number;
  slug: string;
  name: string;
  imageUrl: string | null;
  bannerUrl: string | null;
  displayOrder: number;
  children: CategoryNode[];
}

// GET /categories/{slug}
export interface CategoryDetailResponse {
  id: number;
  slug: string;
  name: string;
  // Not shown null in the one example, but inferred nullable by analogy with the
  // product/category translation fields (description/metaTitle/metaDescription are
  // explicitly null in admin translation examples).
  description: string | null;
  imageUrl: string | null;
  bannerUrl: string | null;
  children: CategoryNode[];
  breadcrumb: CategoryBreadcrumbItem[];
  metaTitle: string | null;
  metaDescription: string | null;
}

// POST /admin/brands, PUT /admin/brands/{id}
export interface BrandUpsertRequest {
  slug?: string;
  nameAr: string;
  nameEn: string;
  logoUrl?: string | null;
  active?: boolean;
}

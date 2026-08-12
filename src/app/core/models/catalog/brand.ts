// logoUrl nullable — confirmed by GET /admin/brands example ("retired-brand" -> logoUrl: null).
export interface BrandResponse {
  id: number;
  slug: string;
  name: string;
  logoUrl: string | null;
}

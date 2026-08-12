// GET/POST /admin/products/{id}/images — thumbUrl explicitly null in the contract example
// (thumbnailing isn't implemented server-side yet).
export interface AdminImageResponse {
  id: number;
  key: string;
  url: string;
  thumbUrl: string | null;
  altTextAr: string;
  altTextEn: string;
  main: boolean;
  displayOrder: number;
  variantId: number | null;
}

// PUT /admin/products/{id}/images/{imageId} — "All fields optional/nullable — only
// supplied fields are applied."
export interface ImageUpdateRequest {
  variantId?: number | null;
  altTextAr?: string | null;
  altTextEn?: string | null;
  main?: boolean;
  displayOrder?: number;
}

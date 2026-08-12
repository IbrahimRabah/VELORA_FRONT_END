// Storefront image shape (product/variant images). thumbUrl marked nullable by analogy with
// the admin AdminImageResponse, which explicitly shows thumbUrl: null — not shown null here
// directly, so this is an inferred nullability, not a literal example.
export interface ImageResponse {
  id: number;
  url: string;
  thumbUrl: string | null;
  alt: string;
  main: boolean;
}

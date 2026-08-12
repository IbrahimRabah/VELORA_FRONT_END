import { TranslationInput } from './translation';

// POST /admin/categories, PUT /admin/categories/{id} — parentId and bannerUrl are
// explicitly null in the contract example.
export interface CategoryUpsertRequest {
  parentId: number | null;
  slug?: string;
  translations: TranslationInput[];
  imageUrl?: string | null;
  bannerUrl?: string | null;
  displayOrder?: number;
  active?: boolean;
}

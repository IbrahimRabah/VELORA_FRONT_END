import { CategoryNode } from '../../../core/models';

// The three curated slugs the About page links out to — same slugs the home page's
// category showcase keys its local artwork off (see category-showcase.component.ts).
export interface CategoryIds {
  watches: number | null;
  wallets: number | null;
  perfumes: number | null;
}

export function findCategoryIds(categories: CategoryNode[]): CategoryIds {
  const bySlug = new Map(categories.map((category) => [category.slug, category.id]));
  return {
    watches: bySlug.get('watches') ?? null,
    wallets: bySlug.get('wallets') ?? null,
    perfumes: bySlug.get('perfumes') ?? null,
  };
}

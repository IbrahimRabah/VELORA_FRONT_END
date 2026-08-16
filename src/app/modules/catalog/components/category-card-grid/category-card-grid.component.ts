import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface CategoryCard {
  id: number;
  label: string;
  count: number | null;
  image: string | null;
}

@Component({
  selector: 'app-category-card-grid',
  templateUrl: './category-card-grid.component.html',
  styleUrl: './category-card-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryCardGridComponent {
  @Input() cards: CategoryCard[] = [];

  // Per-card broken-image tracking (a category added without a matching image folder
  // shouldn't render a broken <img> icon) — same pattern as the hero/promo banners.
  private readonly brokenIds = new Set<number>();

  isBroken(id: number): boolean {
    return this.brokenIds.has(id);
  }

  onImageError(id: number): void {
    this.brokenIds.add(id);
  }
}

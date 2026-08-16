import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

// Sentinel returned in the page list to render an ellipsis instead of a page button.
const ELLIPSIS = -1;

@Component({
  selector: 'app-vl-pagination',
  templateUrl: './vl-pagination.component.html',
  styleUrl: './vl-pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlPaginationComponent {
  // Both 0-indexed, matching PageResponse straight from the API — the template
  // is the only place that adds 1 for display.
  @Input() page = 0;
  @Input() totalPages = 0;
  @Output() readonly pageChange = new EventEmitter<number>();

  readonly ellipsis = ELLIPSIS;

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.page;
    // Few enough pages to just show them all.
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i);
    }

    const pages = new Set<number>([0, total - 1, current]);
    if (current > 0) pages.add(current - 1);
    if (current < total - 1) pages.add(current + 1);

    const sorted = [...pages].sort((a, b) => a - b);
    const withGaps: number[] = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
        withGaps.push(ELLIPSIS);
      }
      withGaps.push(sorted[i]);
    }
    return withGaps;
  }

  goTo(page: number): void {
    if (page === this.page || page < 0 || page >= this.totalPages) return;
    this.pageChange.emit(page);
  }
}

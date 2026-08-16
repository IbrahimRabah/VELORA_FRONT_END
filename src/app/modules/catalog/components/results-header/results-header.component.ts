import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { SortOption } from '../../../../core/enums/sort-option';
import { ActiveFilterChip } from '../active-filters-bar/active-filters-bar.component';

@Component({
  selector: 'app-results-header',
  templateUrl: './results-header.component.html',
  styleUrl: './results-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultsHeaderComponent {
  @Input() totalElements = 0;
  @Input() searchQuery: string | null = null;
  @Input() sort: SortOption = SortOption.NEWEST;
  @Input() chips: ActiveFilterChip[] = [];

  @Output() readonly sortChange = new EventEmitter<SortOption>();
  @Output() readonly removeChip = new EventEmitter<string>();
}

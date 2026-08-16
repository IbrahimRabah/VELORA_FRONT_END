import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface ActiveFilterChip {
  key: string;
  label: string;
}

@Component({
  selector: 'app-active-filters-bar',
  templateUrl: './active-filters-bar.component.html',
  styleUrl: './active-filters-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveFiltersBarComponent {
  @Input() chips: ActiveFilterChip[] = [];
  @Output() readonly remove = new EventEmitter<string>();
}

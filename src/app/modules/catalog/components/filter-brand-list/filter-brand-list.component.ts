import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { BrandResponse } from '../../../../core/models';

@Component({
  selector: 'app-filter-brand-list',
  templateUrl: './filter-brand-list.component.html',
  styleUrl: './filter-brand-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterBrandListComponent {
  @Input({ required: true }) brands: BrandResponse[] = [];
  @Input() selectedIds: number[] = [];
  @Output() readonly toggle = new EventEmitter<number>();

  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }
}

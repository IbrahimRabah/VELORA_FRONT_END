import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AttributeGroupResponse } from '../../../../core/models';

@Component({
  selector: 'app-filter-color-swatches',
  templateUrl: './filter-color-swatches.component.html',
  styleUrl: './filter-color-swatches.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterColorSwatchesComponent {
  @Input({ required: true }) group!: AttributeGroupResponse;
  @Input() selectedIds: number[] = [];
  @Output() readonly toggle = new EventEmitter<number>();

  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }
}

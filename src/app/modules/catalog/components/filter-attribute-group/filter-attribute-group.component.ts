import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AttributeGroupResponse } from '../../../../core/models';

@Component({
  selector: 'app-filter-attribute-group',
  templateUrl: './filter-attribute-group.component.html',
  styleUrl: './filter-attribute-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterAttributeGroupComponent {
  @Input({ required: true }) group!: AttributeGroupResponse;
  @Input() selectedIds: number[] = [];
  @Output() readonly toggle = new EventEmitter<number>();

  isSelected(id: number): boolean {
    return this.selectedIds.includes(id);
  }
}

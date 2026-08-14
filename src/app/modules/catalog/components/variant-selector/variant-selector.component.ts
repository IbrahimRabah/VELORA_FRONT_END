import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AttributeGroupResponse } from '../../../../core/models';

@Component({
  selector: 'app-variant-selector',
  templateUrl: './variant-selector.component.html',
  styleUrl: './variant-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantSelectorComponent {
  @Input({ required: true }) colorGroup!: AttributeGroupResponse;
  @Input() selectedValueId: number | null = null;
  @Output() readonly selectedValueIdChange = new EventEmitter<number>();

  get selectedValueName(): string | null {
    return this.colorGroup.values.find((value) => value.id === this.selectedValueId)?.name ?? null;
  }

  select(valueId: number): void {
    this.selectedValueIdChange.emit(valueId);
  }
}

import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vl-filter-chip',
  templateUrl: './vl-filter-chip.component.html',
  styleUrl: './vl-filter-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlFilterChipComponent {
  @Input({ required: true }) label!: string;
  @Output() readonly remove = new EventEmitter<void>();
}

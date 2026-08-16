import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vl-empty-state',
  templateUrl: './vl-empty-state.component.html',
  styleUrl: './vl-empty-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlEmptyStateComponent {
  @Input() icon = 'pi-inbox';
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() actionLabel: string | null = null;
  @Output() readonly action = new EventEmitter<void>();
}

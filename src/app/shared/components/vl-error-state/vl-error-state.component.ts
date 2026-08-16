import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vl-error-state',
  templateUrl: './vl-error-state.component.html',
  styleUrl: './vl-error-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlErrorStateComponent {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Output() readonly retry = new EventEmitter<void>();
}

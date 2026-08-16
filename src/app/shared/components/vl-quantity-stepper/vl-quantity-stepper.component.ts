import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-vl-quantity-stepper',
  templateUrl: './vl-quantity-stepper.component.html',
  styleUrl: './vl-quantity-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlQuantityStepperComponent {
  @Input({ required: true }) value!: number;
  @Input() min = 1;
  @Input() max = 99;
  @Input() disabled = false;

  @Output() readonly decrease = new EventEmitter<void>();
  @Output() readonly increase = new EventEmitter<void>();
}

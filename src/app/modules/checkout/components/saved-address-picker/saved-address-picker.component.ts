import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { AddressResponse } from '../../../../core/models';

@Component({
  selector: 'app-saved-address-picker',
  templateUrl: './saved-address-picker.component.html',
  styleUrl: './saved-address-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedAddressPickerComponent {
  @Input() addresses: AddressResponse[] = [];
  @Input() selectedId: number | null = null;

  @Output() readonly select = new EventEmitter<number>();
  @Output() readonly useDifferent = new EventEmitter<void>();
}

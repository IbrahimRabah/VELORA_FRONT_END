import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-payment-status-dialog',
  templateUrl: './payment-status-dialog.component.html',
  styleUrl: './payment-status-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentStatusDialogComponent {

}

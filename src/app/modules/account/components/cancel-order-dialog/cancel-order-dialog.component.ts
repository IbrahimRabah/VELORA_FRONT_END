import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cancel-order-dialog',
  templateUrl: './cancel-order-dialog.component.html',
  styleUrl: './cancel-order-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelOrderDialogComponent {

}

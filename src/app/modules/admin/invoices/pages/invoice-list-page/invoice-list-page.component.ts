import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-invoice-list-page',
  templateUrl: './invoice-list-page.component.html',
  styleUrl: './invoice-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListPageComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-customer-list-page',
  templateUrl: './customer-list-page.component.html',
  styleUrl: './customer-list-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListPageComponent {

}

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-product-specs-table',
  templateUrl: './product-specs-table.component.html',
  styleUrl: './product-specs-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductSpecsTableComponent {

}

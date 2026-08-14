import { ChangeDetectionStrategy, Component } from '@angular/core';

// Mirrors vl-product-card's layout (image + name + brand + price) so the loading
// state never causes a layout shift when the real card swaps in.
@Component({
  selector: 'app-vl-skeleton',
  templateUrl: './vl-skeleton.component.html',
  styleUrl: './vl-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VlSkeletonComponent {

}

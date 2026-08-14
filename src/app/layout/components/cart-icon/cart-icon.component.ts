import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartStoreService } from '../../../core/state/cart-store.service';

@Component({
  selector: 'app-cart-icon',
  templateUrl: './cart-icon.component.html',
  styleUrl: './cart-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartIconComponent {
  private readonly cartStore = inject(CartStoreService);

  readonly itemCount = this.cartStore.itemCount;
}

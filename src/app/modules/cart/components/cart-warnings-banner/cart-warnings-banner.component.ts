import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CartWarning } from '../../../../core/enums/cart-warning';
import { CartWarningEntry } from '../../../../core/models';
import { CartStoreService } from '../../../../core/state/cart-store.service';

@Component({
  selector: 'app-cart-warnings-banner',
  templateUrl: './cart-warnings-banner.component.html',
  styleUrl: './cart-warnings-banner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartWarningsBannerComponent {
  readonly cartStore = inject(CartStoreService);

  get blockingWarnings(): CartWarningEntry[] {
    return this.cartStore.blockingWarnings();
  }

  get priceChangedWarnings(): CartWarningEntry[] {
    return (this.cartStore.cart()?.warnings ?? []).filter((warning) => warning.code === CartWarning.PRICE_CHANGED);
  }
}

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CartStoreService } from '../../../../core/state/cart-store.service';

@Component({
  selector: 'app-cart-summary',
  templateUrl: './cart-summary.component.html',
  styleUrl: './cart-summary.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartSummaryComponent {
  private readonly router = inject(Router);
  readonly cartStore = inject(CartStoreService);

  goToCheckout(): void {
    if (!this.cartStore.checkoutReady()) {
      return;
    }
    this.router.navigate(['/checkout']);
  }
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { OrderConfirmationPageComponent } from './pages/order-confirmation-page/order-confirmation-page.component';
import { checkoutReadyGuard } from '../../core/guards/checkout-ready.guard';

const routes: Routes = [
  // Guarded on the form page only — by the time the customer reaches /success/:orderNumber
  // the order already succeeded and the cart has been retired, so checkoutReady is expected
  // to be false there; gating this route too would incorrectly block the confirmation page.
  { path: '', component: CheckoutPageComponent, canActivate: [checkoutReadyGuard] },
  { path: 'success/:orderNumber', component: OrderConfirmationPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutRoutingModule { }

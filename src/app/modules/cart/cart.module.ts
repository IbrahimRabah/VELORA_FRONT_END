import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './pages/cart-page/cart-page.component';
import { CartItemRowComponent } from './components/cart-item-row/cart-item-row.component';
import { CartSummaryComponent } from './components/cart-summary/cart-summary.component';
import { CartWarningsBannerComponent } from './components/cart-warnings-banner/cart-warnings-banner.component';
import { EmptyCartComponent } from './components/empty-cart/empty-cart.component';
import { CartDrawerComponent } from './components/cart-drawer/cart-drawer.component';


@NgModule({
  declarations: [
    CartPageComponent,
    CartItemRowComponent,
    CartSummaryComponent,
    CartWarningsBannerComponent,
    EmptyCartComponent,
    CartDrawerComponent
  ],
  imports: [
    CommonModule,
    CartRoutingModule
  ]
})
export class CartModule { }

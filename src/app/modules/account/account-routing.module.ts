import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { AddressesPageComponent } from './pages/addresses-page/addresses-page.component';
import { OrdersPageComponent } from './pages/orders-page/orders-page.component';
import { OrderDetailsPageComponent } from './pages/order-details-page/order-details-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'addresses', component: AddressesPageComponent },
  { path: 'orders', component: OrdersPageComponent },
  { path: 'orders/:id', component: OrderDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

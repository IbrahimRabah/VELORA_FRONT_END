import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListPageComponent } from './pages/customer-list-page/customer-list-page.component';
import { CustomerDetailsPageComponent } from './pages/customer-details-page/customer-details-page.component';

const routes: Routes = [
  { path: '', component: CustomerListPageComponent },
  { path: ':id', component: CustomerDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }

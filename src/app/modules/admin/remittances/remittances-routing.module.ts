import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RemittanceListPageComponent } from './pages/remittance-list-page/remittance-list-page.component';
import { OutstandingPageComponent } from './pages/outstanding-page/outstanding-page.component';
import { RemittanceFormPageComponent } from './pages/remittance-form-page/remittance-form-page.component';
import { RemittanceDetailsPageComponent } from './pages/remittance-details-page/remittance-details-page.component';

const routes: Routes = [
  { path: '', component: RemittanceListPageComponent },
  { path: 'outstanding', component: OutstandingPageComponent },
  { path: 'new', component: RemittanceFormPageComponent },
  { path: ':id', component: RemittanceDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemittancesRoutingModule { }

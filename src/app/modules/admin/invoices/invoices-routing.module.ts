import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InvoiceListPageComponent } from './pages/invoice-list-page/invoice-list-page.component';
import { UninvoicedReportPageComponent } from './pages/uninvoiced-report-page/uninvoiced-report-page.component';
import { InvoiceDetailsPageComponent } from './pages/invoice-details-page/invoice-details-page.component';

const routes: Routes = [
  { path: '', component: InvoiceListPageComponent },
  { path: 'uninvoiced', component: UninvoicedReportPageComponent },
  { path: ':id', component: InvoiceDetailsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvoicesRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ZonesPageComponent } from './pages/zones-page/zones-page.component';

const routes: Routes = [
  { path: '', component: ZonesPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShippingRoutingModule { }

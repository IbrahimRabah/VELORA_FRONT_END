import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingRoutingModule } from './shipping-routing.module';
import { ZonesPageComponent } from './pages/zones-page/zones-page.component';
import { RatesFormComponent } from './components/rates-form/rates-form.component';


@NgModule({
  declarations: [
    ZonesPageComponent,
    RatesFormComponent
  ],
  imports: [
    CommonModule,
    ShippingRoutingModule
  ]
})
export class ShippingModule { }

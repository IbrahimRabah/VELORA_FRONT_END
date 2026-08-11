import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { StoreProfilePageComponent } from './pages/store-profile-page/store-profile-page.component';
import { MissingFieldsBannerComponent } from './components/missing-fields-banner/missing-fields-banner.component';


@NgModule({
  declarations: [
    StoreProfilePageComponent,
    MissingFieldsBannerComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule
  ]
})
export class SettingsModule { }

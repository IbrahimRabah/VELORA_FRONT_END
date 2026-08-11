import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreProfilePageComponent } from './pages/store-profile-page/store-profile-page.component';

const routes: Routes = [
  { path: '', component: StoreProfilePageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

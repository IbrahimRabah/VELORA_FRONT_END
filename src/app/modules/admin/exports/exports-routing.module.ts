import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExportPageComponent } from './pages/export-page/export-page.component';

const routes: Routes = [
  { path: '', component: ExportPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportsRoutingModule { }

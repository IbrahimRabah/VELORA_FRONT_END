import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportsRoutingModule } from './exports-routing.module';
import { ExportPageComponent } from './pages/export-page/export-page.component';
import { ExportFiltersFormComponent } from './components/export-filters-form/export-filters-form.component';


@NgModule({
  declarations: [
    ExportPageComponent,
    ExportFiltersFormComponent
  ],
  imports: [
    CommonModule,
    ExportsRoutingModule
  ]
})
export class ExportsModule { }

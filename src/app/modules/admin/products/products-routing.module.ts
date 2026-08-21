import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductListPageComponent } from './pages/product-list-page/product-list-page.component';
import { ProductFormPageComponent } from './pages/product-form-page/product-form-page.component';
import { unsavedChangesGuard } from '../../../core/guards/unsaved-changes.guard';

const routes: Routes = [
  { path: '', component: ProductListPageComponent },
  { path: 'new', component: ProductFormPageComponent, canDeactivate: [unsavedChangesGuard] },
  { path: ':id', component: ProductFormPageComponent, canDeactivate: [unsavedChangesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

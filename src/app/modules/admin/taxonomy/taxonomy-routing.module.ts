import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryTreePageComponent } from './pages/category-tree-page/category-tree-page.component';
import { BrandListPageComponent } from './pages/brand-list-page/brand-list-page.component';
import { AttributeListPageComponent } from './pages/attribute-list-page/attribute-list-page.component';
import { AttributeFormPageComponent } from './pages/attribute-form-page/attribute-form-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'categories', pathMatch: 'full' },
  { path: 'categories', component: CategoryTreePageComponent },
  { path: 'brands', component: BrandListPageComponent },
  { path: 'attributes', component: AttributeListPageComponent },
  { path: 'attributes/new', component: AttributeFormPageComponent },
  { path: 'attributes/:id', component: AttributeFormPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaxonomyRoutingModule { }

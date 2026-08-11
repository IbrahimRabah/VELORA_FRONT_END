import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListPageComponent } from './pages/product-list-page/product-list-page.component';
import { ProductFormPageComponent } from './pages/product-form-page/product-form-page.component';
import { ProductTranslationsTabComponent } from './components/product-translations-tab/product-translations-tab.component';
import { ProductImagesTabComponent } from './components/product-images-tab/product-images-tab.component';
import { ProductVariantsTabComponent } from './components/product-variants-tab/product-variants-tab.component';
import { ProductSpecsTabComponent } from './components/product-specs-tab/product-specs-tab.component';
import { VariantPreviewDialogComponent } from './components/variant-preview-dialog/variant-preview-dialog.component';
import { VariantMatrixTableComponent } from './components/variant-matrix-table/variant-matrix-table.component';
import { PublishActionsBarComponent } from './components/publish-actions-bar/publish-actions-bar.component';


@NgModule({
  declarations: [
    ProductListPageComponent,
    ProductFormPageComponent,
    ProductTranslationsTabComponent,
    ProductImagesTabComponent,
    ProductVariantsTabComponent,
    ProductSpecsTabComponent,
    VariantPreviewDialogComponent,
    VariantMatrixTableComponent,
    PublishActionsBarComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }

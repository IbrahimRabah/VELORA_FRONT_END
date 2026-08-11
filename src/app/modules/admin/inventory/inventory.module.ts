import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryListPageComponent } from './pages/inventory-list-page/inventory-list-page.component';
import { LowStockPageComponent } from './pages/low-stock-page/low-stock-page.component';
import { MovementsLogPageComponent } from './pages/movements-log-page/movements-log-page.component';
import { ReceiveStockDialogComponent } from './components/receive-stock-dialog/receive-stock-dialog.component';
import { AdjustStockDialogComponent } from './components/adjust-stock-dialog/adjust-stock-dialog.component';
import { StockNumbersCardComponent } from './components/stock-numbers-card/stock-numbers-card.component';


@NgModule({
  declarations: [
    InventoryListPageComponent,
    LowStockPageComponent,
    MovementsLogPageComponent,
    ReceiveStockDialogComponent,
    AdjustStockDialogComponent,
    StockNumbersCardComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    SharedModule
  ]
})
export class InventoryModule { }

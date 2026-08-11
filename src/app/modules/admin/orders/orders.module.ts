import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrderListPageComponent } from './pages/order-list-page/order-list-page.component';
import { OrderDetailsPageComponent } from './pages/order-details-page/order-details-page.component';
import { OrderFiltersBarComponent } from './components/order-filters-bar/order-filters-bar.component';
import { StatusTransitionPanelComponent } from './components/status-transition-panel/status-transition-panel.component';
import { ConfirmCallDialogComponent } from './components/confirm-call-dialog/confirm-call-dialog.component';
import { PaymentStatusDialogComponent } from './components/payment-status-dialog/payment-status-dialog.component';
import { AdminCancelDialogComponent } from './components/admin-cancel-dialog/admin-cancel-dialog.component';
import { OrderAuditPanelComponent } from './components/order-audit-panel/order-audit-panel.component';


@NgModule({
  declarations: [
    OrderListPageComponent,
    OrderDetailsPageComponent,
    OrderFiltersBarComponent,
    StatusTransitionPanelComponent,
    ConfirmCallDialogComponent,
    PaymentStatusDialogComponent,
    AdminCancelDialogComponent,
    OrderAuditPanelComponent
  ],
  imports: [
    CommonModule,
    OrdersRoutingModule,
    SharedModule
  ]
})
export class OrdersModule { }

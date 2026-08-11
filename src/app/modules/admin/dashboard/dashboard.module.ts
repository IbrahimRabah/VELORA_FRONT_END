import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';
import { DeliveryRateChartComponent } from './components/delivery-rate-chart/delivery-rate-chart.component';
import { OutstandingCashCardComponent } from './components/outstanding-cash-card/outstanding-cash-card.component';
import { LowStockWidgetComponent } from './components/low-stock-widget/low-stock-widget.component';
import { RecentOrdersWidgetComponent } from './components/recent-orders-widget/recent-orders-widget.component';


@NgModule({
  declarations: [
    DashboardPageComponent,
    KpiCardComponent,
    DeliveryRateChartComponent,
    OutstandingCashCardComponent,
    LowStockWidgetComponent,
    RecentOrdersWidgetComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

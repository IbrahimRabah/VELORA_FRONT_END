import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditRoutingModule } from './audit-routing.module';
import { AuditLogPageComponent } from './pages/audit-log-page/audit-log-page.component';
import { EntityHistoryPanelComponent } from './components/entity-history-panel/entity-history-panel.component';


@NgModule({
  declarations: [
    AuditLogPageComponent,
    EntityHistoryPanelComponent
  ],
  imports: [
    CommonModule,
    AuditRoutingModule
  ]
})
export class AuditModule { }

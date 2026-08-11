import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogPageComponent } from './pages/audit-log-page/audit-log-page.component';

const routes: Routes = [
  { path: '', component: AuditLogPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditRoutingModule { }

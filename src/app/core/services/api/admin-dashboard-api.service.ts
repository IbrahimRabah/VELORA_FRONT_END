import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { DashboardResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardApiService {
  private readonly http = inject(HttpClient);

  get(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(API_ROUTES.admin.dashboard());
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { CustomerDetailResponse, CustomerSummaryResponse, PageResponse } from '../../models';
import { buildHttpParams } from './http-params.util';

export type AdminCustomerSort = 'spent_desc' | 'orders_desc' | 'recent_order' | 'name';

@Injectable({
  providedIn: 'root',
})
export class AdminCustomerApiService {
  private readonly http = inject(HttpClient);

  list(search?: string, sort?: AdminCustomerSort, page?: number, size?: number): Observable<PageResponse<CustomerSummaryResponse>> {
    const params = buildHttpParams({ search, sort, page, size: size ?? APP_CONFIG.pagination.adminCustomers.size });
    return this.http.get<PageResponse<CustomerSummaryResponse>>(API_ROUTES.admin.customers.customers(), { params });
  }

  get(customerId: number): Observable<CustomerDetailResponse> {
    return this.http.get<CustomerDetailResponse>(API_ROUTES.admin.customers.customer(customerId));
  }
}

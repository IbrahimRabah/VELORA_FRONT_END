import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { CreateRemittanceRequest, OutstandingRemittanceResponse, PageResponse, RemittanceResponse } from '../../models';
import { buildHttpParams } from './http-params.util';

@Injectable({
  providedIn: 'root',
})
export class AdminRemittanceApiService {
  private readonly http = inject(HttpClient);

  // A single object ({ orderCount, totalAmount, orders }), not a page.
  outstanding(): Observable<OutstandingRemittanceResponse> {
    return this.http.get<OutstandingRemittanceResponse>(API_ROUTES.admin.remittances.outstanding());
  }

  create(body: CreateRemittanceRequest): Observable<RemittanceResponse> {
    return this.http.post<RemittanceResponse>(API_ROUTES.admin.remittances.remittances(), body);
  }

  list(page?: number, size?: number): Observable<PageResponse<RemittanceResponse>> {
    const params = buildHttpParams({ page, size: size ?? APP_CONFIG.pagination.remittances.size });
    return this.http.get<PageResponse<RemittanceResponse>>(API_ROUTES.admin.remittances.remittances(), { params });
  }

  get(remittanceId: number): Observable<RemittanceResponse> {
    return this.http.get<RemittanceResponse>(API_ROUTES.admin.remittances.remittance(remittanceId));
  }

  // reason is a required query param, not a body field.
  cancel(remittanceId: number, reason: string): Observable<RemittanceResponse> {
    const params = buildHttpParams({ reason });
    return this.http.post<RemittanceResponse>(API_ROUTES.admin.remittances.cancel(remittanceId), null, { params });
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { CancelInvoiceRequest, InvoiceResponse, PageResponse, UninvoicedReport } from '../../models';
import { buildHttpParams } from './http-params.util';

@Injectable({
  providedIn: 'root',
})
export class AdminInvoiceApiService {
  private readonly http = inject(HttpClient);

  list(page?: number, size?: number): Observable<PageResponse<InvoiceResponse>> {
    const params = buildHttpParams({ page, size: size ?? APP_CONFIG.pagination.invoices.size });
    return this.http.get<PageResponse<InvoiceResponse>>(API_ROUTES.admin.invoices.invoices(), { params });
  }

  get(invoiceId: number): Observable<InvoiceResponse> {
    return this.http.get<InvoiceResponse>(API_ROUTES.admin.invoices.invoice(invoiceId));
  }

  downloadPdf(invoiceId: number): Observable<Blob> {
    return this.http.get(API_ROUTES.admin.invoices.pdf(invoiceId), { responseType: 'blob' });
  }

  // Idempotent — if the order already has an invoice, that one is returned instead of
  // consuming a new number.
  issue(orderId: number): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(API_ROUTES.admin.invoices.issue(orderId), null);
  }

  cancel(invoiceId: number, body: CancelInvoiceRequest): Observable<InvoiceResponse> {
    return this.http.post<InvoiceResponse>(API_ROUTES.admin.invoices.cancel(invoiceId), body);
  }

  // Reconciliation check — should always come back { count: 0, orderIds: [] }.
  uninvoiced(): Observable<UninvoicedReport> {
    return this.http.get<UninvoicedReport>(API_ROUTES.admin.invoices.uninvoiced());
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { SUPPRESS_ERROR_TOAST } from '../../interceptors/error.interceptor';
import { CancelOrderRequest, OrderResponse, OrderSummaryResponse, PageResponse, PlaceOrderRequest } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class OrderApiService {
  private readonly http = inject(HttpClient);

  /**
   * Idempotency-Key is passed in explicitly, not attached by an interceptor — only the
   * caller knows whether this is a fresh checkout attempt or a legitimate retry. Contract
   * rule: a brand-new key for the first attempt; the SAME key while that attempt is still
   * in flight returns 409 DUPLICATE_ORDER; the same key + same body after a SUCCESSFUL
   * attempt replays the same order; but the same key after a FAILED attempt is rejected —
   * a failed attempt must be retried with a FRESH key, never the one that just failed.
   */
  place(body: PlaceOrderRequest, idempotencyKey: string): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(API_ROUTES.orders.place(), body, {
      headers: { 'Idempotency-Key': idempotencyKey },
      context: new HttpContext().set(SUPPRESS_ERROR_TOAST, true),
    });
  }

  myOrders(page?: number, size?: number): Observable<PageResponse<OrderSummaryResponse>> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page);
    }
    params = params.set('size', size ?? APP_CONFIG.pagination.myOrders.size);
    return this.http.get<PageResponse<OrderSummaryResponse>>(API_ROUTES.orders.myOrders(), { params });
  }

  getOrder(orderNumber: string): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(API_ROUTES.orders.myOrderByNumber(orderNumber));
  }

  cancel(orderNumber: string, body: CancelOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(API_ROUTES.orders.cancelMyOrder(orderNumber), body);
  }

  downloadInvoice(invoiceNumber: string): Observable<Blob> {
    return this.http.get(API_ROUTES.orders.myInvoicePdf(invoiceNumber), { responseType: 'blob' });
  }
}

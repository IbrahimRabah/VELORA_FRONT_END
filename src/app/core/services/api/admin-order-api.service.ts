import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { FulfillmentStatus } from '../../enums/fulfillment-status';
import { PaymentStatus } from '../../enums/payment-status';
import { CancelOrderRequest, OrderResponse, OrderSummaryResponse, PageResponse, UpdateFulfillmentRequest } from '../../models';
import { buildHttpParams } from './http-params.util';

@Injectable({
  providedIn: 'root',
})
export class AdminOrderApiService {
  private readonly http = inject(HttpClient);

  // phone takes precedence over status server-side if both are given.
  list(status?: FulfillmentStatus, phone?: string, page?: number, size?: number): Observable<PageResponse<OrderSummaryResponse>> {
    const params = buildHttpParams({ status, phone, page, size: size ?? APP_CONFIG.pagination.adminOrders.size });
    return this.http.get<PageResponse<OrderSummaryResponse>>(API_ROUTES.admin.orders.orders(), { params });
  }

  get(orderId: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(API_ROUTES.admin.orders.order(orderId));
  }

  // note is a query param here, not a body field — defaults server-side to
  // "Confirmed by phone" when omitted.
  confirm(orderId: number, note?: string): Observable<OrderResponse> {
    const params = buildHttpParams({ note });
    return this.http.post<OrderResponse>(API_ROUTES.admin.orders.confirm(orderId), null, { params });
  }

  // Unlike confirm/setPayment, this one IS a JSON body — required when moving to
  // DELIVERY_FAILED / REFUSED_ON_DELIVERY / RETURNED_TO_SELLER / CANCELLED
  // (NOTE_REQUIRED_STATUSES in core/constants/order-status.constants.ts).
  setFulfillment(orderId: number, body: UpdateFulfillmentRequest): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(API_ROUTES.admin.orders.fulfillmentStatus(orderId), body);
  }

  // status and note are query params, not a body. `status` is typed as PaymentStatus
  // deliberately: the contract documents that an invalid status value here surfaces as a
  // raw 500 INTERNAL_ERROR instead of a clean 400 (PaymentStatus.valueOf() throws
  // unchecked in the controller) — so the UI must never let anything but a real
  // PaymentStatus value reach this call.
  setPayment(orderId: number, status: PaymentStatus, note?: string): Observable<OrderResponse> {
    const params = buildHttpParams({ status, note });
    return this.http.patch<OrderResponse>(API_ROUTES.admin.orders.paymentStatus(orderId), null, { params });
  }

  cancel(orderId: number, body: CancelOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(API_ROUTES.admin.orders.cancel(orderId), body);
  }
}

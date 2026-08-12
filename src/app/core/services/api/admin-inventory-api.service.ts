import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { APP_CONFIG } from '../../constants/app-config';
import { AdjustStockRequest, PageResponse, ReceiveStockRequest, StockMovementResponse, StockPositionResponse } from '../../models';
import { buildHttpParams } from './http-params.util';

@Injectable({
  providedIn: 'root',
})
export class AdminInventoryApiService {
  private readonly http = inject(HttpClient);

  getPosition(variantId: number): Observable<StockPositionResponse> {
    return this.http.get<StockPositionResponse>(API_ROUTES.admin.inventory.position(variantId));
  }

  // Not paginated — every variant at or below its minStockLevel, ordered by scarcity.
  lowStock(): Observable<StockPositionResponse[]> {
    return this.http.get<StockPositionResponse[]>(API_ROUTES.admin.inventory.lowStock());
  }

  receive(variantId: number, body: ReceiveStockRequest): Observable<StockPositionResponse> {
    return this.http.post<StockPositionResponse>(API_ROUTES.admin.inventory.receive(variantId), body);
  }

  adjust(variantId: number, body: AdjustStockRequest): Observable<StockPositionResponse> {
    return this.http.post<StockPositionResponse>(API_ROUTES.admin.inventory.adjust(variantId), body);
  }

  // Omit variantId for the full ledger — an unrecognized one just yields an empty page.
  movements(variantId?: number, page?: number, size?: number): Observable<PageResponse<StockMovementResponse>> {
    const params = buildHttpParams({ variantId, page, size: size ?? APP_CONFIG.pagination.inventoryMovements.size });
    return this.http.get<PageResponse<StockMovementResponse>>(API_ROUTES.admin.inventory.movements(), { params });
  }
}

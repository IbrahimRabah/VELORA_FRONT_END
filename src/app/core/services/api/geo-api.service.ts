import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { GovernorateResponse, ShippingQuoteRequest, ShippingQuoteResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class GeoApiService {
  private readonly http = inject(HttpClient);

  getGovernorates(): Observable<GovernorateResponse[]> {
    return this.http.get<GovernorateResponse[]>(API_ROUTES.geo.governorates());
  }

  quote(body: ShippingQuoteRequest): Observable<ShippingQuoteResponse> {
    return this.http.post<ShippingQuoteResponse>(API_ROUTES.shipping.quote(), body);
  }
}

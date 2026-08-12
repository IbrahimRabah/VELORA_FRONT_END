import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { IdResponse, ShippingRateRequest, ShippingZoneResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AdminShippingApiService {
  private readonly http = inject(HttpClient);

  // Not paginated — the catalog only has a handful of zones.
  getZones(): Observable<ShippingZoneResponse[]> {
    return this.http.get<ShippingZoneResponse[]>(API_ROUTES.admin.shipping.zones());
  }

  // Replaces the zone's existing active rate rather than adding a second one.
  setRate(body: ShippingRateRequest): Observable<IdResponse> {
    return this.http.put<IdResponse>(API_ROUTES.admin.shipping.rates(), body);
  }
}

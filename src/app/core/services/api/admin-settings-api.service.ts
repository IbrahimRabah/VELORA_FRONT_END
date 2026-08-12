import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { StoreProfileResponse, StoreProfileUpdateRequest } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AdminSettingsApiService {
  private readonly http = inject(HttpClient);

  getStoreProfile(): Observable<StoreProfileResponse> {
    return this.http.get<StoreProfileResponse>(API_ROUTES.admin.settings.storeProfile());
  }

  updateStoreProfile(body: StoreProfileUpdateRequest): Observable<StoreProfileResponse> {
    return this.http.put<StoreProfileResponse>(API_ROUTES.admin.settings.storeProfile(), body);
  }
}

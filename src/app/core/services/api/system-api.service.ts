import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { PingResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SystemApiService {
  private readonly http = inject(HttpClient);

  ping(): Observable<PingResponse> {
    return this.http.get<PingResponse>(API_ROUTES.system.ping());
  }
}

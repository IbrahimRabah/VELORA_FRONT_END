import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import { AddressResponse, AddressUpsertRequest } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AddressApiService {
  private readonly http = inject(HttpClient);

  list(): Observable<AddressResponse[]> {
    return this.http.get<AddressResponse[]>(API_ROUTES.addresses.addresses());
  }

  create(body: AddressUpsertRequest): Observable<AddressResponse> {
    return this.http.post<AddressResponse>(API_ROUTES.addresses.addresses(), body);
  }

  update(addressId: number, body: AddressUpsertRequest): Observable<AddressResponse> {
    return this.http.put<AddressResponse>(API_ROUTES.addresses.address(addressId), body);
  }

  remove(addressId: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.addresses.address(addressId));
  }

  setDefault(addressId: number): Observable<AddressResponse> {
    return this.http.put<AddressResponse>(API_ROUTES.addresses.setDefault(addressId), null);
  }
}

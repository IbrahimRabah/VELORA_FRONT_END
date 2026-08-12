import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_ROUTES } from '../../constants/api-routes';
import {
  AttributeAdminResponse,
  AttributeUpsertRequest,
  BrandResponse,
  BrandUpsertRequest,
  CategoryNode,
  CategoryUpsertRequest,
  IdResponse,
} from '../../models';
import { buildHttpParams } from './http-params.util';

@Injectable({
  providedIn: 'root',
})
export class AdminTaxonomyApiService {
  private readonly http = inject(HttpClient);

  // Full tree including inactive categories — same shape as the storefront tree.
  listCategories(): Observable<CategoryNode[]> {
    return this.http.get<CategoryNode[]>(API_ROUTES.admin.categories.categories());
  }

  createCategory(body: CategoryUpsertRequest): Observable<IdResponse> {
    return this.http.post<IdResponse>(API_ROUTES.admin.categories.categories(), body);
  }

  updateCategory(categoryId: number, body: CategoryUpsertRequest): Observable<IdResponse> {
    return this.http.put<IdResponse>(API_ROUTES.admin.categories.category(categoryId), body);
  }

  // All brands including inactive — same shape as the storefront GET /brands.
  listBrands(): Observable<BrandResponse[]> {
    return this.http.get<BrandResponse[]>(API_ROUTES.admin.brands.brands());
  }

  createBrand(body: BrandUpsertRequest): Observable<IdResponse> {
    return this.http.post<IdResponse>(API_ROUTES.admin.brands.brands(), body);
  }

  updateBrand(brandId: number, body: BrandUpsertRequest): Observable<IdResponse> {
    return this.http.put<IdResponse>(API_ROUTES.admin.brands.brand(brandId), body);
  }

  // variantDefining is optional — omit it entirely (not `undefined`) to list every
  // attribute; pass true/false to filter to SKU-generating vs. specification-only ones.
  listAttributes(variantDefining?: boolean): Observable<AttributeAdminResponse[]> {
    const params = buildHttpParams({ variantDefining });
    return this.http.get<AttributeAdminResponse[]>(API_ROUTES.admin.attributes.attributes(), { params });
  }

  createAttribute(body: AttributeUpsertRequest): Observable<IdResponse> {
    return this.http.post<IdResponse>(API_ROUTES.admin.attributes.attributes(), body);
  }

  updateAttribute(attributeId: number, body: AttributeUpsertRequest): Observable<IdResponse> {
    return this.http.put<IdResponse>(API_ROUTES.admin.attributes.attribute(attributeId), body);
  }
}

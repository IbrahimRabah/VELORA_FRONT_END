import { HttpParams } from '@angular/common/http';

export type ParamValue = string | number | boolean | undefined | null;

// Shared by every admin-*-api service that takes optional query params — drops
// undefined/null/'' entirely rather than sending them as literal "undefined" strings.
export function buildHttpParams(source: Record<string, ParamValue>): HttpParams {
  let params = new HttpParams();
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    params = params.set(key, value);
  }
  return params;
}

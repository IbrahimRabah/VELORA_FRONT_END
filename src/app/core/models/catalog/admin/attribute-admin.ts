import { AttributeDataType } from '../../../enums/attribute-data-type';
import { NameTranslationInput } from './translation';

// GET /admin/attributes — deliberately independent from the storefront's
// AttributeGroupResponse/AttributeValueResponse (catalog/attribute.ts): the admin shape
// returns separate nameAr/nameEn plus variantDefining/filterable, the storefront returns
// one already-translated `name`. Do not reuse between the two.
export interface AttributeValueAdminResponse {
  id: number;
  code: string;
  // Only meaningful for color-type values — inferred nullable, no non-color example shown.
  hexColor: string | null;
  displayOrder: number;
  nameAr: string;
  nameEn: string;
}

export interface AttributeAdminResponse {
  id: number;
  code: string;
  dataType: AttributeDataType;
  variantDefining: boolean;
  filterable: boolean;
  displayOrder: number;
  nameAr: string;
  nameEn: string;
  values: AttributeValueAdminResponse[];
}

export interface AttributeValueUpsertItem {
  id: number | null;
  code: string;
  hexColor?: string | null;
  displayOrder?: number;
  translations: NameTranslationInput[];
}

// POST /admin/attributes, PUT /admin/attributes/{id} — values[] entries with id set
// update that value, id: null creates a new one (merged, not replaced wholesale on update).
export interface AttributeUpsertRequest {
  code: string;
  dataType?: AttributeDataType;
  variantDefining?: boolean;
  filterable?: boolean;
  displayOrder?: number;
  translations: NameTranslationInput[];
  values?: AttributeValueUpsertItem[];
}

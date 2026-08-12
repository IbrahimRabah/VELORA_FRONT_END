// GET/PUT /admin/settings/store-profile — single row, the seller's legal identity printed
// on invoices. taxNumber/commercialRegister are explicitly null in the example; the rest
// are inferred nullable because the PUT doc states "all other fields optional".
export interface StoreProfileResponse {
  legalName: string;
  legalNameEn: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  taxNumber: string | null;
  commercialRegister: string | null;
  website: string | null;
  invoiceFooterNote: string | null;
  missingFields: string[];
}

// PUT /admin/settings/store-profile
export interface StoreProfileUpdateRequest {
  legalName: string;
  legalNameEn?: string;
  address?: string;
  phone?: string;
  email?: string;
  taxNumber?: string;
  commercialRegister?: string;
  website?: string;
  invoiceFooterNote?: string;
}

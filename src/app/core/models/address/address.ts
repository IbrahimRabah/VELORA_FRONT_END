// GET/POST/PUT /me/addresses — altPhone is explicitly null in the contract example.
// area/building/floor/apartment/landmark are inferred nullable from the matching
// "optional" fields on AddressUpsertRequest below.
export interface AddressResponse {
  id: number;
  // Free text, max 30 chars — the contract suggests HOME | WORK | OTHER as the intended
  // values but doesn't declare them a closed enum, so this stays a plain string.
  label: string;
  recipientName: string;
  phone: string;
  altPhone: string | null;
  governorateId: number;
  governorateName: string;
  area: string | null;
  streetAddress: string;
  building: string | null;
  floor: string | null;
  apartment: string | null;
  landmark: string | null;
  isDefault: boolean;
  formatted: string;
}

// POST/PUT /me/addresses
export interface AddressUpsertRequest {
  label?: string;
  recipientName: string;
  phone: string;
  altPhone?: string;
  governorateId: number;
  area?: string;
  streetAddress: string;
  building?: string;
  floor?: string;
  apartment?: string;
  landmark?: string;
  makeDefault?: boolean;
}

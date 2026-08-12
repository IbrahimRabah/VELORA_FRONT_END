import { Language } from '../../enums/language';

// POST /auth/me returns firstName/lastName/fullName = null (built from JWT claims, not a DB
// lookup). email/phone are nullable because register only requires one of the two.
export interface UserResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  locale: Language;
  // TODO: not in contract — only "CUSTOMER" is ever shown in an example; the admin role's
  // literal string (e.g. "ADMIN") is never shown in a roles[] JSON array.
  roles: string[];
}

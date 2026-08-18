import { UserResponse } from '../../core/models';

// POST /auth/me returns firstName/lastName/fullName = null (JWT-claims only) — callers
// must pass the UserResponse persisted by auth-store (from login/register), never the
// raw /auth/me response, or the name silently disappears.
export function getDisplayName(user: UserResponse | null): string {
  if (!user) return '';
  return user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.phone || user.email || '';
}

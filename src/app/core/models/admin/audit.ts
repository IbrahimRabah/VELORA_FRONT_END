// GET /admin/audit, GET /admin/audit/{entityType}/{entityId}
export interface AuditEntryResponse {
  id: number;
  // TODO: not in contract — only "PRICE_CHANGED" is shown as a literal example; the
  // prose lists categories (stock adjustments, publish/archive, shipping-rate changes,
  // invoice cancellations, payment adjustments, permission changes, store-profile
  // changes) without giving their exact AuditAction strings.
  action: string;
  entityType: string;
  // "the entity's id as text", per the contract.
  entityId: string;
  entityLabel: string;
  // Inferred nullable — a creation event has no previous value.
  oldValue: string | null;
  newValue: string | null;
  // Inferred nullable — not every audited action necessarily carries a reason.
  reason: string | null;
  actorId: number;
  actorName: string;
  createdAt: string;
}

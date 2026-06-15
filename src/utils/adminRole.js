/** Rôles admin canoniques (minuscules, sans espaces). */
export const ADMIN_ROLE_VALUES = ["admin", "administrateur"];

const ADMIN_ROLES = new Set(ADMIN_ROLE_VALUES);

/** Normalise un rôle Firestore pour comparaison (trim + minuscules). */
export function normalizeAdminRole(role) {
  if (role == null || role === "") return "";
  return String(role).trim().toLowerCase();
}

/** Vrai si le rôle correspond à un administrateur. */
export function isAdminRole(role) {
  return ADMIN_ROLES.has(normalizeAdminRole(role));
}

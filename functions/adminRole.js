/** Rôles admin canoniques (minuscules, sans espaces). */
const ADMIN_ROLE_VALUES = ["admin", "administrateur"];

const ADMIN_ROLES = new Set(ADMIN_ROLE_VALUES);

function normalizeAdminRole(role) {
  if (role == null || role === "") return "";
  return String(role).trim().toLowerCase();
}

function isAdminRole(role) {
  return ADMIN_ROLES.has(normalizeAdminRole(role));
}

module.exports = {
  ADMIN_ROLE_VALUES,
  normalizeAdminRole,
  isAdminRole,
};

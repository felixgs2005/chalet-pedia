import adminEmailConfig from "./adminEmail.json";

/** Courriel admin — source unique : src/config/adminEmail.json */
export const ADMIN_EMAIL = adminEmailConfig.email;

export function normalizeAdminEmail(email) {
  return String(email || "").trim().toLowerCase();
}

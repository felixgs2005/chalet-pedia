import adminEmailConfig from "./adminEmail.json";

/** Courriel admin — synchroniser avec functions/adminEmail.json */
export const ADMIN_EMAIL = adminEmailConfig.email;

export function normalizeAdminEmail(email) {
  return String(email || "").trim().toLowerCase();
}

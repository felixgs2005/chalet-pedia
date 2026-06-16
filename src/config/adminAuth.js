/** Identifiants admin (vérification locale — hash SHA-256, jamais le mot de passe en clair). */
export const ADMIN_EMAIL = "wintechnologie830@gmail.com";

/** SHA-256 hex du mot de passe admin. Regénérer avec hashAdminPassword() si changement. */
export const ADMIN_PASSWORD_HASH =
  "98c0fd71493c2bb35676ad55809477a6714c65d874dd585bad47314928409294";

export const ADMIN_SESSION_KEY = "chaletpedia_admin_session";

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function normalizeAdminEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function readAdminSession() {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return (
      data?.authenticated === true &&
      normalizeAdminEmail(data?.email) === normalizeAdminEmail(ADMIN_EMAIL)
    );
  } catch {
    return false;
  }
}

export function writeAdminSession() {
  sessionStorage.setItem(
    ADMIN_SESSION_KEY,
    JSON.stringify({
      email: normalizeAdminEmail(ADMIN_EMAIL),
      authenticated: true,
      at: Date.now(),
    })
  );
}

export async function hashAdminPassword(plain) {
  const data = new TextEncoder().encode(String(plain));
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminCredentials(email, password) {
  if (normalizeAdminEmail(email) !== normalizeAdminEmail(ADMIN_EMAIL)) {
    return false;
  }
  const hash = await hashAdminPassword(password);
  return hash === ADMIN_PASSWORD_HASH;
}

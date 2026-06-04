/** Retourne l'e-mail normalisé ou null si invalide. */
export function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return null;
  }
  return email;
}

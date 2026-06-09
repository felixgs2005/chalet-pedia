/** Extrait uniquement les chiffres d'un prix (texte ou nombre). */
export function parsePrixDigits(value) {
  return String(value ?? "").replace(/\D/g, "");
}

/** Formate un montant en dollars canadiens : « 845 000 $ » */
export function formatPrixCAD(value) {
  const digits = parsePrixDigits(value);
  if (!digits) return "";
  const num = Number(digits);
  if (!Number.isFinite(num) || num <= 0) return "";
  return `${num.toLocaleString("fr-CA")} $`;
}

/** Formate un prix par nuit : « 250 $ » */
export function formatPrixNuit(value) {
  if (value == null || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "";
  return `${num.toLocaleString("fr-CA")} $`;
}

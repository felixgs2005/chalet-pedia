/** Retire les champs `undefined` (Firestore les rejette). */
export function sanitizeForFirestore(value) {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForFirestore(item));
  }

  const out = {};
  for (const [key, val] of Object.entries(value)) {
    if (val === undefined) continue;
    out[key] = sanitizeForFirestore(val);
  }
  return out;
}

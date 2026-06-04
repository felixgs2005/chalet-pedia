import { normalizeEmail } from "./normalizeEmail";

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/** Cherche un courriel dans les blocs description (annonces service legacy). */
export function extractEmailFromDescription(description) {
  if (!Array.isArray(description)) return null;

  for (const block of description) {
    const parts = [];
    if (typeof block === "string") {
      parts.push(block);
    } else if (block?.contenu && Array.isArray(block.contenu)) {
      parts.push(...block.contenu);
    } else if (block?.texte) {
      parts.push(block.texte);
    }

    for (const part of parts) {
      const match = String(part).match(EMAIL_RE);
      const email = normalizeEmail(match?.[0]);
      if (email) return email;
    }
  }

  return null;
}

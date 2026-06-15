/** Convertit une valeur Firestore (Timestamp, etc.) en texte affichable par React. */
export function formatDisplayValue(value) {
  if (value == null || value === "") return "";

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (
    typeof value === "object" &&
    value.seconds != null &&
    value.nanoseconds != null
  ) {
    return new Date(value.seconds * 1000).toLocaleString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (Array.isArray(value)) {
    return value.map(formatDisplayValue).filter(Boolean).join(", ");
  }

  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

/** Date courte pour les listes (ex. datePublication d'une annonce service). */
export function formatFirestoreDate(value) {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value?.toDate === "function") {
    return value.toDate().toLocaleDateString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  if (
    typeof value === "object" &&
    value.seconds != null &&
    value.nanoseconds != null
  ) {
    return new Date(value.seconds * 1000).toLocaleDateString("fr-CA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  return formatDisplayValue(value);
}

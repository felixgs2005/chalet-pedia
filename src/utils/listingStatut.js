/** Normalisation des statuts d'annonces (chalets, ventes, services). */

function extractStatut(input) {
  if (input != null && typeof input === "object") {
    return input.statut ?? input.status ?? "";
  }
  return input ?? "";
}

function normalizeRawStatut(statut) {
  return String(statut ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function normalizeListingStatut(input) {
  const raw = extractStatut(input);
  if (raw === "" || raw == null) return "legacy";

  const s = normalizeRawStatut(raw);

  if (s === "publie" || s === "published" || s.startsWith("publi")) {
    return "published";
  }
  if (s === "en attente" || s === "en_attente" || s === "pending") {
    return "pending";
  }
  if (s === "rejete" || s === "rejected" || s.startsWith("rejet")) {
    return "rejected";
  }

  return s;
}

export function isListingPublished(input) {
  const key = normalizeListingStatut(input);
  return key === "published" || key === "legacy";
}

export function isListingPending(input) {
  return normalizeListingStatut(input) === "pending";
}

export function isListingRejected(input) {
  return normalizeListingStatut(input) === "rejected";
}

export function listingStatutLabel(input) {
  const key = normalizeListingStatut(input);
  switch (key) {
    case "published":
    case "legacy":
      return "Publiée";
    case "pending":
      return "En attente";
    case "rejected":
      return "Refusée";
    default:
      return String(extractStatut(input) || "—");
  }
}

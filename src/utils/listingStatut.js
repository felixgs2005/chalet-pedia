/** Normalisation des statuts d'annonces (chalets, ventes, services). */

export function normalizeListingStatut(statut) {
  const raw = statut ?? "";
  if (raw === "" || raw == null) return "legacy";

  const s = String(raw).trim().toLowerCase();

  if (s === "publié" || s === "publie" || s === "published" || s.startsWith("publi")) {
    return "published";
  }
  if (/en[_ ]?attente/.test(s) || s === "pending") {
    return "pending";
  }
  if (s === "rejeté" || s === "rejete" || s === "rejected" || s.startsWith("rejet")) {
    return "rejected";
  }

  return s;
}

export function isListingPublished(statut) {
  const key = normalizeListingStatut(statut);
  return key === "published" || key === "legacy";
}

export function isListingPending(statut) {
  return normalizeListingStatut(statut) === "pending";
}

export function isListingRejected(statut) {
  return normalizeListingStatut(statut) === "rejected";
}

export function listingStatutLabel(statut) {
  const key = normalizeListingStatut(statut);
  switch (key) {
    case "published":
    case "legacy":
      return "Publiée";
    case "pending":
      return "En attente";
    case "rejected":
      return "Refusée";
    default:
      return String(statut || "—");
  }
}

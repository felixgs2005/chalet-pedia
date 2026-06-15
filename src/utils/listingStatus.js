/** Annonce visible sur le site public. */
export function isListingPublished(data) {
  const statut = data?.statut ?? data?.status;
  if (!statut) return true;
  const s = String(statut)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return s === "publie" || s === "published";
}

/** Annonce en attente de validation admin. */
export function isListingPending(data) {
  const statut = data?.statut ?? data?.status;
  if (!statut) return false;
  const s = String(statut)
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return s === "en attente" || s === "en_attente" || s === "pending";
}

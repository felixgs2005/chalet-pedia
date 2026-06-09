/** Indique si l'annonce affiche le bouton « Magasiner le catalogue ». */
export function hasCatalogueLink(listing) {
  return Boolean(listing?.lienCatalogue?.trim());
}

export function resolveLienCatalogue(listing) {
  return listing?.lienCatalogue?.trim() || "";
}

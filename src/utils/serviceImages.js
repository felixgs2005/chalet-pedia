/** Photos principales si Firestore n’a pas encore été re-seedé. */
const PRIMARY_IMAGE_BY_SLUG = {
  "ova-chalet-design": "/images/services/OvaChalet.webp",
  "meubles-de-chalet-cle-en-main-lot-complet-a-vendre": "/images/services/MeubleDeChalet.webp",
  "verbois-meubles-contemporains-fabriques-au-quebec": "/images/services/Verbois.webp",
  "rustik-decorations-en-bois-pour-chalets": "/images/services/Rustik.webp",
};

/** Vignette + galerie : la photo principale (image) est toujours en premier. */
export function resolveServiceImages(listing) {
  const thumb =
    listing?.image ||
    (listing?.slug && PRIMARY_IMAGE_BY_SLUG[listing.slug]) ||
    "";
  const gallery = Array.isArray(listing?.images)
    ? listing.images.filter(Boolean)
    : [];

  if (thumb) {
    const rest = gallery.filter((url) => url !== thumb);
    return [thumb, ...rest];
  }

  return gallery.length ? gallery : [];
}

export function getServicePrimaryImage(listing) {
  return resolveServiceImages(listing)[0] || "";
}

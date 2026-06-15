/** Photos principales si Firestore n’a pas encore été re-seedé. */
const PRIMARY_IMAGE_BY_SLUG = {
  "ova-chalet-design": "/images/services/OvaChalet.webp",
  "meubles-de-chalet-cle-en-main-lot-complet-a-vendre": "/images/services/MeubleDeChalet.webp",
  "verbois-meubles-contemporains-fabriques-au-quebec": "/images/services/Verbois.webp",
  "rustik-decorations-en-bois-pour-chalets": "/images/services/Rustik.webp",
};

function isValidImageUrl(url) {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

/** Extrait une URL affichable depuis une chaîne ou un objet Firestore. */
export function toImageUrl(entry) {
  if (!entry) return "";

  if (typeof entry === "string") {
    const value = entry.trim();
    return isValidImageUrl(value) ? value : "";
  }

  if (typeof entry === "object") {
    const candidate =
      entry.url || entry.src || entry.downloadURL || entry.href || "";
    return typeof candidate === "string" && isValidImageUrl(candidate.trim())
      ? candidate.trim()
      : "";
  }

  return "";
}

/** Normalise images (tableau ou map Firestore indexée). */
export function normalizeImageList(images) {
  if (!images) return [];
  const list = Array.isArray(images) ? images : Object.values(images);
  return list.map(toImageUrl).filter(Boolean);
}

/** Vignette + galerie : la photo principale (image) est toujours en premier. */
export function resolveServiceImages(listing) {
  const thumb =
    toImageUrl(listing?.image) ||
    (listing?.slug && PRIMARY_IMAGE_BY_SLUG[listing.slug]) ||
    "";
  const gallery = normalizeImageList(listing?.images);

  if (thumb) {
    const rest = gallery.filter((url) => url !== thumb);
    return [thumb, ...rest];
  }

  return gallery;
}

export function getServicePrimaryImage(listing) {
  return resolveServiceImages(listing)[0] || "";
}

/** Galerie admin / détail — chalets, ventes ou services. */
export function resolveListingImages(item) {
  if (!item) return [];

  if (item._collection === "services") {
    return resolveServiceImages(item);
  }

  const gallery = normalizeImageList(item.images);
  if (gallery.length) return gallery;

  const single = toImageUrl(item.image) || toImageUrl(item.cardImage);
  return single ? [single] : [];
}

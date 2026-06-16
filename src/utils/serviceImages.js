/** Photos principales si Firestore n’a pas encore été re-seedé. */
const PRIMARY_IMAGE_BY_SLUG = {
  "ova-chalet-design": "/images/services/OvaChalet.webp",
  "meubles-de-chalet-cle-en-main-lot-complet-a-vendre": "/images/services/MeubleDeChalet.webp",
  "verbois-meubles-contemporains-fabriques-au-quebec": "/images/services/Verbois.webp",
  "rustik-decorations-en-bois-pour-chalets": "/images/services/Rustik.webp",
};

function coerceImageString(value) {
  if (typeof value !== "string") return value;
  return value.trim().replace(/^["']|["']$/g, "");
}

function isValidImageUrl(url) {
  if (!url || url.length < 8) return false;
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("/")
  );
}

/** Champ image principal — aligné sur mapFirestoreServiceListing. */
export function listingPrimaryImageField(listing) {
  return (
    listing?.image ||
    listing?.imageHero ||
    listing?.image_hero ||
    listing?.cardImage ||
    ""
  );
}

/** Extrait une URL affichable depuis une chaîne ou un objet Firestore. */
export function toImageUrl(entry) {
  if (!entry) return "";

  if (typeof entry === "string") {
    const value = coerceImageString(entry);
    return isValidImageUrl(value) ? value : "";
  }

  if (typeof entry === "object") {
    const candidate = coerceImageString(
      entry.url ||
        entry.src ||
        entry.downloadURL ||
        entry.downloadUrl ||
        entry.href ||
        entry.value ||
        ""
    );
    return isValidImageUrl(candidate) ? candidate : "";
  }

  return "";
}

/** Normalise images (tableau, map Firestore ou chaîne multiligne). */
export function normalizeImageList(images) {
  if (!images) return [];

  if (typeof images === "string") {
    const value = coerceImageString(images);
    if (!value) return [];
    if (value.includes("\n") || value.includes(",")) {
      return value
        .split(/[\n,]+/)
        .map((part) => toImageUrl(part))
        .filter(Boolean);
    }
    const single = toImageUrl(value);
    return single ? [single] : [];
  }

  const list = Array.isArray(images) ? images : Object.values(images);
  return list.map(toImageUrl).filter(Boolean);
}

/** Vignette + galerie : la photo principale (image) est toujours en premier. */
export function resolveServiceImages(listing) {
  const thumb =
    toImageUrl(listingPrimaryImageField(listing)) ||
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

/** Vignette admin / cartes — chalets, ventes ou services. */
export function getListingPrimaryImage(item) {
  return resolveListingImages(item)[0] || "";
}

/** Galerie admin / détail — chalets, ventes ou services. */
export function resolveListingImages(item) {
  if (!item) return [];

  if (item._collection === "services") {
    return resolveServiceImages(item);
  }

  const gallery = normalizeImageList(item.images);
  if (gallery.length) return gallery;

  const single = toImageUrl(listingPrimaryImageField(item));
  return single ? [single] : [];
}

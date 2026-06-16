/** Images déjà normalisées par fetchAllListingsForAdmin — pas de re-résolution. */
export function getAdminListingImages(item) {
  if (!item) return [];
  if (Array.isArray(item.images) && item.images.length) {
    return item.images;
  }
  return item.image ? [item.image] : [];
}

export function getAdminListingPrimaryImage(item) {
  return getAdminListingImages(item)[0] || "";
}

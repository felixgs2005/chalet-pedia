export function listingLabel(item) {
  return item?.nom || item?.titre || item?.slug || item?.id || "";
}

export function collectionLabel(collection) {
  if (collection === "ventes") return "À vendre";
  if (collection === "services") return "Service";
  return "À louer";
}

// Configuration des pages de listing par région (alignée sur chaletpedia.com)

const REGIONAL_PREFIX = "chalets-a-louer-";

export const LISTING_REGIONS = {
  all: {
    key: "all",
    slug: null,
    title: "Chalets à louer",
    documentTitle: "Chalets à louer au Québec | Chaletpedia",
    breadcrumb: null,
    categoryLabel: null,
    description:
      "Découvrez les plus beaux chalets à louer au Québec parmi une grande sélection.",
    match: () => true,
  },
  laurentides: {
    key: "laurentides",
    slug: "laurentides",
    title: "Chalets à louer dans les Laurentides",
    documentTitle: "Chalets à Louer dans les Laurentides | Nature, Spa et Lac",
    breadcrumb: "Laurentides",
    categoryLabel: "Chalets à louer dans les Laurentides",
    description:
      "La région des Laurentides est l'une des plus prisées pour la location de chalets au Québec. Située entre montagnes, lacs et forêts, elle offre une multitude d'activités en toute saison.",
    match: (chalet) => (chalet.region || "").toLowerCase().includes("laurentides"),
  },
  gaspesie: {
    key: "gaspesie",
    slug: "gaspesie",
    title: "Chalets à louer en Gaspésie",
    documentTitle: "Chalets à louer en Gaspésie | Chaletpedia",
    breadcrumb: "Gaspésie",
    categoryLabel: "Chalets à louer en Gaspésie",
    description:
      "Découvrez les plus beaux chalets à louer en Gaspésie parmi une grande sélection.",
    match: (chalet) => {
      const r = (chalet.region || "").toLowerCase();
      const l = (chalet.regionLabel || "").toLowerCase();
      return r.includes("gaspésie") || r.includes("gaspesie") || l.includes("gaspesie");
    },
  },
  saguenay: {
    key: "saguenay",
    slug: "saguenay-lac-saint-jean",
    title: "Chalets à louer au Saguenay-Lac-Saint-Jean",
    documentTitle: "Chalets à louer au Saguenay-Lac-Saint-Jean | Chaletpedia",
    breadcrumb: "Saguenay-Lac-Saint-Jean",
    categoryLabel: "Chalets à louer au Saguenay-Lac-Saint-Jean",
    description:
      "Découvrez les plus beaux chalets à louer au Saguenay-Lac-Saint-Jean parmi une grande sélection.",
    match: (chalet) => {
      const r = (chalet.region || "").toLowerCase();
      return r.includes("saguenay");
    },
  },
};

export const REGION_NAV_ITEMS = [
  { key: "all", label: "Toutes les régions" },
  { key: "laurentides", label: "Laurentides" },
  { key: "gaspesie", label: "Gaspésie" },
  { key: "saguenay", label: "Saguenay-Lac-Saint-Jean" },
];

export function getRegionKeyFromSlug(slug) {
  if (!slug) return "all";
  const entry = Object.values(LISTING_REGIONS).find((r) => r.slug === slug);
  return entry?.key ?? "all";
}

/** @deprecated Utiliser parseListingPageSlug depuis listingPageSlug.js */
export function getRegionKeyFromPageSlug(pageSlug) {
  if (!pageSlug || pageSlug === "chalet-a-louer") return "all";
  if (!pageSlug.startsWith(REGIONAL_PREFIX)) return null;
  const suffix = pageSlug.slice(REGIONAL_PREFIX.length).replace(/\/$/, "");
  const entry = Object.values(LISTING_REGIONS).find((r) => r.slug === suffix);
  return entry?.key ?? null;
}

export function getPageSlugFromRegionKey(key) {
  if (!key || key === "all") return "chalet-a-louer";
  const config = getRegionConfig(key);
  if (!config.slug) return "chalet-a-louer";
  return `${REGIONAL_PREFIX}${config.slug}`;
}

export function getRegionConfig(key) {
  return LISTING_REGIONS[key] ?? LISTING_REGIONS.all;
}

export function countChaletsByRegion(chalets, key) {
  const config = getRegionConfig(key);
  return chalets.filter(config.match).length;
}

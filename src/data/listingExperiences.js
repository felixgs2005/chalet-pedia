import { chaletHasFeature } from "../utils/chaletFeatures";

export const LISTING_EXPERIENCES = {
  animaux: {
    key: "animaux",
    slug: "animaux-permis",
    featureKey: "animaux",
    title: "Chalets à louer — Animaux permis",
    documentTitle: "Chalets à louer avec animaux permis | Chaletpedia",
    breadcrumb: "Animaux permis",
    categoryLabel: "Animaux permis",
    menuLabel: "Animaux permis",
    menuIcon: "🐕",
    description:
      "Trouvez un chalet à louer au Québec où vos compagnons à quatre pattes sont les bienvenus.",
    match: (chalet) => chaletHasFeature(chalet, "animaux"),
  },
  bordEau: {
    key: "bordEau",
    slug: "bord-de-leau",
    featureKey: "bordEau",
    title: "Chalets à louer — Bord de l'eau",
    documentTitle: "Chalets à louer au bord de l'eau | Chaletpedia",
    breadcrumb: "Bord de l'eau",
    categoryLabel: "Bord de l'eau",
    menuLabel: "Bord de l'eau",
    menuIcon: "💦",
    description:
      "Lacs, rivières et fjords : découvrez des chalets au bord de l'eau pour des vacances au Québec.",
    match: (chalet) => chaletHasFeature(chalet, "bordEau"),
  },
  spa: {
    key: "spa",
    slug: "avec-spa",
    featureKey: "spa",
    title: "Chalets à louer — Avec spa",
    documentTitle: "Chalets à louer avec spa | Chaletpedia",
    breadcrumb: "Avec spa",
    categoryLabel: "Avec spa",
    menuLabel: "Avec spa",
    menuIcon: "♨",
    description:
      "Détente garantie : parcourez nos chalets à louer avec spa extérieur ou sauna au Québec.",
    match: (chalet) => chaletHasFeature(chalet, "spa"),
  },
  boise: {
    key: "boise",
    slug: "secteur-boise",
    featureKey: "boise",
    title: "Chalets à louer — Secteur boisé",
    documentTitle: "Chalets à louer en secteur boisé | Chaletpedia",
    breadcrumb: "Secteur boisé",
    categoryLabel: "Secteur boisé",
    menuLabel: "Secteur boisé",
    menuIcon: "🌲",
    description:
      "Immersion en nature : chalets en forêt et secteurs boisés pour un séjour paisible au Québec.",
    match: (chalet) => chaletHasFeature(chalet, "boise"),
  },
  plage: {
    key: "plage",
    slug: "avec-plage",
    featureKey: "plage",
    title: "Chalets à louer — Avec plage",
    documentTitle: "Chalets à louer avec plage | Chaletpedia",
    breadcrumb: "Avec plage",
    categoryLabel: "Avec plage",
    menuLabel: "Avec plage",
    menuIcon: "⛱️",
    description:
      "Plage privée ou accès direct : des chalets idéaux pour profiter de l'eau en été.",
    match: (chalet) => chaletHasFeature(chalet, "plage"),
  },
  foyer: {
    key: "foyer",
    slug: "avec-foyer",
    featureKey: "foyer",
    title: "Chalets à louer — Avec foyer",
    documentTitle: "Chalets à louer avec foyer | Chaletpedia",
    breadcrumb: "Avec foyer",
    categoryLabel: "Avec foyer",
    menuLabel: "Avec foyer",
    menuIcon: "🔥",
    description:
      "Soirées au chaud : chalets avec foyer intérieur ou extérieur pour vos vacances au Québec.",
    match: (chalet) => chaletHasFeature(chalet, "foyer"),
  },
  couples: {
    key: "couples",
    slug: "pour-couples",
    featureKey: "couples",
    title: "Chalets à louer — Pour les couples",
    documentTitle: "Chalets à louer pour les couples | Chaletpedia",
    breadcrumb: "Pour les couples",
    categoryLabel: "Pour les couples",
    menuLabel: "Pour les couples",
    menuIcon: "💞",
    description:
      "Escapades romantiques : chalets cosy et intimes pour deux, partout au Québec.",
    match: (chalet) => chaletHasFeature(chalet, "couples"),
  },
};

export const EXPERIENCE_NAV_ITEMS = [
  { key: "all", label: "Toutes les expériences" },
  { key: "animaux", label: "Animaux permis" },
  { key: "bordEau", label: "Bord de l'eau" },
  { key: "spa", label: "Avec spa" },
  { key: "boise", label: "Secteur boisé" },
  { key: "plage", label: "Avec plage" },
  { key: "foyer", label: "Avec foyer" },
  { key: "couples", label: "Pour les couples" },
];

export function getExperienceConfig(key) {
  if (!key || key === "all") return null;
  return LISTING_EXPERIENCES[key] ?? null;
}

export function countChaletsByExperience(chalets, key) {
  const config = getExperienceConfig(key);
  if (!config) return chalets.length;
  return chalets.filter(config.match).length;
}

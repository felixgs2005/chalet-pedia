// src/data/services.js
// Données centralisées — catégories de services et options du sélecteur

export const serviceCategories = [
  {
    slug: "construction",
    nom: "Construction",
    description:
      "Services de construction, rénovation et agrandissement de chalets.",
    tagline: "Bâtir & rénover",
    annonceCount: 1,
    image: "/images/services/construction.webp",
    href: "/chalets/construction/",
  },
  {
    slug: "decoration",
    nom: "Décoration",
    description:
      "Mobilier, aménagement et décoration intérieure & extérieure.",
    tagline: "Aménager avec style",
    annonceCount: 3,
    image: "/images/services/decoration.webp",
  },
  {
    slug: "entretien",
    nom: "Entretien",
    description:
      "Ménage, entretien du terrain, piscine, spa et déneigement.",
    tagline: "Garder impeccable",
    annonceCount: 2,
    image: "/images/services/entretien.webp",
  },
  {
    slug: "multimedia",
    nom: "Multimédia",
    description:
      "Photographie, vidéos et captation par drone pour vos chalets.",
    tagline: "Mettre en valeur",
    annonceCount: 1,
    image: "/images/services/multimedia.webp",
  },
];

export const serviceCategorySlugs = new Set(
  serviceCategories.map((c) => c.slug)
);

export const categorySelectGroups = [
  {
    label: "Chalets à louer",
    options: [
      { value: "chalets-louer", label: "Chalets à louer" },
      { value: "bas-saint-laurent", label: "Bas-Saint-Laurent" },
      { value: "centre-du-quebec", label: "Centre-du-Québec" },
      { value: "laurentides", label: "Chalets à louer dans les Laurentides" },
      { value: "charlevoix", label: "Charlevoix" },
      { value: "chaudiere-appalaches", label: "Chaudière-Appalaches" },
      { value: "estrie", label: "Estrie" },
      { value: "gaspesie", label: "Gaspésie" },
      { value: "lanaudiere", label: "Lanaudière" },
      { value: "mauricie", label: "Mauricie" },
      { value: "monteregie", label: "Montérégie" },
      { value: "outaouais", label: "Outaouais" },
      { value: "saguenay", label: "Saguenay-Lac-Saint-Jean" },
    ],
  },
  {
    label: "Autres",
    options: [{ value: "chalets-vendre", label: "Chalets à vendre" }],
  },
  {
    label: "Services de chalet au Québec",
    options: [
      { value: "services", label: "Services de chalet au Québec" },
      { value: "construction", label: "Construction" },
      { value: "decoration", label: "Décoration" },
      { value: "entretien", label: "Entretien" },
      { value: "multimedia", label: "Multimédia" },
    ],
  },
];

export function getTotalAnnonces(categories = serviceCategories) {
  return categories.reduce((sum, cat) => sum + cat.annonceCount, 0);
}

export function pluralizeAnnonce(count) {
  return count <= 1 ? "annonce" : "annonces";
}

export function getCategoryBySlug(slug) {
  return serviceCategories.find((c) => c.slug === slug);
}

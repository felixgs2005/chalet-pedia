// src/data/services.js
// Constantes UI pour la page services (données chargées depuis Firestore).

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

export function getTotalAnnonces(categories = []) {
  return categories.reduce((sum, cat) => sum + (cat.annonceCount || 0), 0);
}

export function pluralizeAnnonce(count) {
  return count <= 1 ? "annonce" : "annonces";
}

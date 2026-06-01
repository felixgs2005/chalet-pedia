// src/data/ventes.js
// ============================================================
// DONNÉES DYNAMIQUES — CHALETS À VENDRE
// Source de vérité pour la page liste (/chalets/chalets-a-vendre/)
// et les fiches dynamiques (/chalets/chalets-a-vendre/:slug).
// Pour ajouter une propriété, ajoutez un objet à ce tableau.
// ============================================================

export const ventes = [
  {
    id: 1,
    slug: "chalet-luxe-grand-lac-saint-francois",
    region: "Chaudière-Appalaches",
    regionBadge: "CHAUDIÈRE-APPALACHES",
    nom: "Chalet de luxe — Grand Lac Saint-François",
    titre: "Chalet de luxe au Grand Lac Saint-François.",
    localisation: "Chaudière-Appalaches, Québec",
    chambres: 3,
    sdb: 3,
    garages: 2,
    etages: 2,
    prix: "1 389 900 $",
    annonceId: "567",
    cardImage:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=85&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&q=85&auto=format&fit=crop",
    ],
    descriptionTitre: "Vivez le summum du confort moderne dans un cadre naturel d'exception.",
    descriptionHtml:
      "Situé sur les rives convoitées du <strong>Grand Lac Saint-François</strong>, ce chalet contemporain marie design haut de gamme, matériaux nobles et vue panoramique sur l'eau. Revêtu de <strong>Maibec</strong> avec toiture en tôle durable, il s'intègre parfaitement à son environnement naturel tout en offrant une architecture raffinée et intemporelle.",
    features: [
      {
        titre: "Une vue à couper le souffle",
        icon: "fa-water",
        items: [
          "Fenestration abondante pour une immersion visuelle sur le lac",
          "Vaste terrasse couverte sur deux étages",
          "Accès direct au jardin paysagé depuis le rez-de-chaussée",
          "Deux garages spacieux intégrés",
        ],
      },
      {
        titre: "Trois suites somptueuses",
        icon: "fa-bed",
        items: [
          "3 chambres avec walk-in et salle de bain attenante",
          "Finitions haut de gamme et design épuré",
          "Confort, intimité et fonctionnalité réunis",
        ],
      },
      {
        titre: "Cuisine digne d'un chef",
        icon: "fa-utensils",
        items: [
          "Comptoir en quartz de plus de 7 pieds",
          "Refroidisseur à vin encastré",
          "Grand garde-manger fermé",
          "Électroménagers haut de gamme intégrés aux armoires sur mesure",
        ],
      },
      {
        titre: "Ambiance & technologie",
        icon: "fa-cogs",
        items: [
          "Salon avec foyer au propane et vue directe sur le lac",
          "Système de domotique complet : éclairage, chauffage, stores, son",
          "Système de son <strong>BOSE</strong> intégré dans toutes les pièces",
        ],
      },
      {
        titre: "Un investissement dans le calme et le prestige",
        icon: "fa-hand-holding-usd",
        items: [
          "Emplacement exceptionnel sur les rives du Grand Lac Saint-François",
          "Qualité de construction irréprochable",
          "Expérience de vie haut de gamme au bord de l'eau",
        ],
      },
    ],
    priceFeatures: [
      { label: "Chambres", value: "3" },
      { label: "Salles de bain", value: "3" },
      { label: "Garages", value: "2" },
      { label: "Revêtement", value: "Maibec" },
      { label: "Domotique", value: "BOSE" },
    ],
  },
];

export const getVenteBySlug = (slug) => ventes.find((v) => v.slug === slug);

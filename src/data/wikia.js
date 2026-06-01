// src/data/wikia.js
// ============================================================
// DONNÉES DE LA PAGE WIKIA (/academie/astuces/Wikia)
// Wiki de connaissances sur l'univers du chalet au Québec.
// ============================================================

export const wikiaCategories = [
  {
    id: "location",
    icon: "🏡",
    titre: "Location de chalet",
    description:
      "Conseils pour locataires et propriétaires, réglementations, plateformes et bonnes pratiques.",
    couleur: "#1f4d3a",
  },
  {
    id: "construction",
    icon: "🔨",
    titre: "Construction & rénovation",
    description:
      "Types de structures, matériaux, permis, normes environnementales, A-Frame, mini-chalets…",
    couleur: "#2a4a2e",
  },
  {
    id: "decoration",
    icon: "🛋️",
    titre: "Décoration & aménagement",
    description:
      "Styles rustique, scandinave, moderne. Mobilier, éclairage, ambiance et tendances déco.",
    couleur: "#4a3a1f",
  },
  {
    id: "eco",
    icon: "🌿",
    titre: "Éco-responsabilité",
    description:
      "Chauffage écologique, matériaux durables, gestion de l'eau, autonomie énergétique.",
    couleur: "#1a4a2a",
  },
  {
    id: "fiscalite",
    icon: "📋",
    titre: "Fiscalité & législation",
    description:
      "Revenus locatifs, taxes, assurance, lois locales, résidence principale ou secondaire.",
    couleur: "#1f2a4d",
  },
  {
    id: "vocabulaire",
    icon: "📖",
    titre: "Vocabulaire du chalet",
    description:
      "Glossaire complet des termes utilisés dans l'univers du chalet au Québec.",
    couleur: "#3a1f4d",
  },
];

export const wikiaThemes = [
  {
    id: "location",
    titre: "Location et l'Achat de Chalets",
    faq: [
      {
        q: "Quel est le prix moyen d'un chalet à louer au Québec ?",
        r: "Le tarif varie selon la région, la saison et les équipements. Comptez entre 150 $ et 600 $ par nuit pour un chalet standard, et jusqu'à 1 500 $ pour un chalet haut de gamme avec spa et vue sur lac.",
      },
      {
        q: "Faut-il un numéro CITQ pour louer son chalet ?",
        r: "Oui, depuis 2021, tout hébergement touristique au Québec doit être enregistré auprès de la CITQ. L'affichage du numéro est obligatoire sur toutes les annonces.",
      },
      {
        q: "Quelle plateforme choisir pour louer son chalet ?",
        r: "ChaletPedia, Airbnb, VRBO et Chalets.com sont les principales plateformes. ChaletPedia est spécialisée pour le marché québécois et offre une meilleure visibilité locale.",
      },
    ],
    articles: [
      {
        emoji: "🤑",
        titre: "Chalets à louer : tarifs et astuces pour économiser",
        slug: "/academie/astuces/",
      },
      {
        emoji: "🏴‍☠️",
        titre: "Les pièges à éviter lors de la location d'un chalet",
        slug: "/academie/astuces/15-pieges-eviter-location-chalet",
      },
      {
        emoji: "🦝",
        titre: "Fraude location de chalets : astuces pour ne pas se faire avoir",
        slug: "/academie/astuces/",
      },
    ],
    ressources: [
      { label: "Guide CITQ officiel", url: "https://www.citq.qc.ca/" },
      { label: "Calculateur de revenus locatifs", url: "/academie/astuces/" },
    ],
  },
  {
    id: "construction",
    titre: "Chalets A-Frame",
    faq: [
      {
        q: "Qu'est-ce qu'un chalet A-Frame ?",
        r: "Un A-Frame est un chalet dont la structure en forme de triangle (comme la lettre A) descend jusqu'au sol. Ce style est populaire pour son esthétique moderne et sa résistance aux chutes de neige.",
      },
      {
        q: "Combien coûte la construction d'un A-Frame ?",
        r: "Le coût varie entre 150 000 $ et 400 000 $ selon la superficie, les matériaux et la région. Les kits préfabriqués peuvent réduire les coûts de 20 à 30 %.",
      },
      {
        q: "Faut-il un permis pour construire un chalet A-Frame ?",
        r: "Oui, un permis de construction est obligatoire dans toutes les municipalités du Québec. Les exigences varient selon la zone (bord de l'eau, forêt, etc.).",
      },
    ],
    articles: [
      {
        emoji: "🏗️",
        titre: "Construire un A-Frame : guide complet étape par étape",
        slug: "/academie/astuces/",
      },
      {
        emoji: "💰",
        titre: "Budget construction chalet : ce qu'il faut prévoir",
        slug: "/academie/astuces/5-astuces-augmenter-reservations-chalet-locatif",
      },
      {
        emoji: "🌲",
        titre: "Matériaux écologiques pour la construction de chalets",
        slug: "/academie/astuces/",
      },
    ],
    ressources: [
      { label: "Régie du bâtiment du Québec", url: "https://www.rbq.gouv.qc.ca/" },
      { label: "Normes de construction en zone inondable", url: "/academie/astuces/" },
    ],
  },
  {
    id: "decoration",
    titre: "Décoration & Aménagement",
    faq: [
      {
        q: "Quel style de décoration est le plus populaire pour les chalets ?",
        r: "Le style chalet scandinave (hygge) et le style rustique moderne sont les plus tendance. Ils misent sur les matériaux naturels, les tons neutres et une ambiance chaleureuse.",
      },
      {
        q: "Comment maximiser l'espace dans un petit chalet ?",
        r: "Optez pour des meubles multifonctionnels, des lits escamotables, des rangements intégrés et des couleurs claires pour agrandir visuellement l'espace.",
      },
      {
        q: "Quels éléments augmentent la valeur locative d'un chalet ?",
        r: "Un spa extérieur, une cheminée, une cuisine bien équipée et une décoration soignée peuvent augmenter le tarif de location de 20 à 40 %.",
      },
    ],
    articles: [
      {
        emoji: "🎄",
        titre: "Noël au chalet : guide de décoration festive",
        slug: "/academie/astuces/noel-au-chalet-guide-decoration",
      },
      {
        emoji: "🛁",
        titre: "Aménager une salle de bain de chalet : tendances 2025",
        slug: "/academie/astuces/",
      },
      {
        emoji: "🪵",
        titre: "Choisir le bon bois pour l'intérieur de votre chalet",
        slug: "/academie/astuces/",
      },
    ],
    ressources: [
      { label: "Inspirations déco sur Pinterest", url: "https://www.pinterest.ca/" },
      { label: "Guide des styles de chalets québécois", url: "/academie/astuces/" },
    ],
  },
];

export const wikiaStats = [
  { num: "6", label: "catégories de connaissances" },
  { num: "50+", label: "articles et guides" },
  { num: "100%", label: "contenu québécois" },
];

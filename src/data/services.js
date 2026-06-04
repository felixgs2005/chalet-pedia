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
    listings: [
      {
        slug: "ova-chalet-design",
        titre: "OVA Chalet Design - Design de Chalets Privés & Locatifs",
        localisation: "Québec, Québec, Canada",
        date: "16 mai 2025",
        numero: 2926,
        image: "/images/services/OvaChalet.webp",
        images: [
          "/images/services/OvaChalet.webp",
          "/images/services/construction.webp",
        ],
        accroche: "Créons votre espace de rêve en pleine nature !",
        intro:
          "Notre équipe de designers d'intérieur conçoit des chalets personnalisés selon vos besoins et goûts.",
        services: [
          "Service Complet de Design : rénovation, agrandissement, plan, modélisation 3D…",
          "Construction Neuve de Chalet : conception, plan, matériaux…",
        ],
        carte: "Québec, Québec, Canada",
        lienCatalogue: "https://www.ovachaletdesign.com/",
      },
    ],
  },
  {
    slug: "decoration",
    nom: "Décoration",
    description:
      "Mobilier, aménagement et décoration intérieure & extérieure.",
    tagline: "Aménager avec style",
    annonceCount: 3,
    image: "/images/services/decoration.webp",
    href: "/chalets/decoration/",
    listings: [
      {
        slug: "meubles-de-chalet-cle-en-main-lot-complet-a-vendre",
        titre: "Meubles de chalet clé en main – lot complet à vendre",
        localisation: "Québec, Canada",
        date: "3 octobre 2025",
        numero: 3887,
        image: "/images/services/MeubleDeChalet.webp",
        images: [
          "/images/services/MeubleDeChalet.webp",
          "/images/services/decoration.webp",
        ],
        carte: "Québec, Canada",
        description: [
          { h: "Lot complet de meubles pour chalet – prêt à l'emploi" },
          {
            p: "Vous cherchez un lot complet de meubles pour aménager votre chalet ou démarrer un chalet locatif immédiatement ? Ce lot est prêt à l'emploi et inclut tous les meubles essentiels avec un style chaleureux et fonctionnel.",
          },
          { h: "Pourquoi ce lot est parfait" },
          {
            ul: [
              "Économisez du temps et de l'argent : tout est inclus, pas besoin d'acheter pièce par pièce.",
              "Mobilier de qualité et en parfait état",
              "Mise en valeur optimale grâce aux photos dans le chalet",
              "Idéal pour un investissement locatif ou usage personnel",
            ],
          },
          { h: "Électroniques" },
          { ul: ["2 TV 50'' DEL 4K – garantie jusqu'au 19 février 2026 – 850 $ chacun"] },
          { h: "Électroménagers" },
          {
            ul: [
              "Frigo – garantie jusqu'au 19 février 2027 – 900 $",
              "Lave-vaisselle Samsung – garantie jusqu'au 19 février 2027 – 450 $",
              "Cuisinière Samsung – garantie jusqu'au 19 février 2027 – 600 $",
              "Hotte / micro-ondes Samsung – 200 $",
              "Laveuse frontale Samsung – garantie jusqu'au 19 février 2027 – 600 $",
              "Sécheuse frontale Samsung – garantie jusqu'au 19 février 2027 – 600 $",
            ],
          },
          { h: "Petit électroménager" },
          { ul: ["Grille-pain – 50 $", "Cafetière – 50 $", "Pompe submersible pour spa – 50 $"] },
          { h: "Mobilier" },
          {
            ul: [
              "2 lits superposés (double en bas, simple en haut) avec matelas et literie – 2 500 $",
              "2 lits queen avec matelas et literie – 500 $ chacun",
              "Commode dans chaque chambre – 200 $ chacune",
              "Bureau – 50 $",
              "Salon (en haut, 2 fauteuils jaunes) – 1 000 $",
              "Salon (en bas, sectionnel gris) – 1 000 $",
              "Salle à manger – 500 $",
              "Chaises extérieures (achetées en 2025) – 50 $",
            ],
          },
          { h: "Textiles et accessoires" },
          { ul: ["Serviettes, vaisselle, draps, couettes, housses et oreillers supplémentaires"] },
          { h: "Prix" },
          { p: "Lot complet : 11 500 $", bold: true },
          { h: "Avantages pour l'acheteur" },
          {
            ul: [
              "Lot prêt à installer",
              "Parfait pour louer rapidement un chalet",
              "Mobilier stylé et fonctionnel",
            ],
          },
          { h: "Contactez-nous dès maintenant" },
          {
            p: "Réservez ce lot et transformez votre chalet en un espace prêt à accueillir vos invités ! Contactez-nous par téléphone ou via le formulaire.",
          },
        ],
      },
      {
        slug: "verbois-meubles-contemporains-fabriques-au-quebec",
        titre: "Verbois - Meubles contemporains fabriqués au Québec",
        localisation: "Rivière-du-Loup, Québec, Canada",
        date: "17 janvier 2025",
        numero: 2178,
        image: "/images/services/Verbois.webp",
        images: [
          "/images/services/Verbois.webp",
          "/images/services/decoration.webp",
        ],
        carte: "Rivière-du-Loup, Québec, Canada",
        description: [
          {
            p: "Fondée en 1999, Verbois est une entreprise manufacturière de meubles contemporains résidentiels fabriqués à la main dans son usine unique, située à Rivière-du-Loup au Québec, Canada.",
          },
          {
            p: "Nous nous spécialisons dans le mobilier de bois et de verre, avec des touches d'aluminium et d'acier, pour meubler toutes les pièces de la maison : la salle à manger, le salon, la chambre à coucher et le bureau.",
          },
          {
            p: "Nous nous distinguons par l'utilisation du noyer massif, par l'innovation stratégique dans tous nos procédés, par notre étroite collaboration avec tous nos détaillants et par notre flexibilité. Nos créations sont disponibles en une variété de dimensions, configurations, en dimensions sur mesure, et dans un choix de noyer ou de merisier, dans un éventail de plus de 22 teintes de couleur.",
          },
        ],
        lienCatalogue: "https://verbois.com/produits/",
      },
      {
        slug: "rustik-decorations-en-bois-pour-chalets",
        titre: "RUSTIK | Décorations en bois pour chalets 🪵",
        localisation: "Saint-Sauveur, Québec, Québec, Canada",
        date: "28 octobre 2024",
        numero: 1281,
        image: "/images/services/Rustik.webp",
        images: [
          "/images/services/Rustik.webp",
          "/images/services/decoration.webp",
        ],
        carte: "Saint-Sauveur, Québec, Canada",
        description: [
          { h: "🪵 RUSTIK — Décorations en bois authentiques pour chalets locatifs" },
          {
            p: "Donnez du caractère à votre chalet avec les créations en bois signées RUSTIK. Fabriquées à la main au Québec, nos décorations s'inspirent de la nature et de l'univers du bois pour transformer votre espace en refuge chaleureux qui séduira vos invités dès leur arrivée.",
          },
          { h: "Pourquoi choisir RUSTIK pour décorer votre chalet :" },
          {
            ul: [
              "📸 Valorisez vos photos d'annonce avec des éléments visuels forts",
              "🏡 Créez une ambiance rustique, conviviale et 100 % chalet",
              "🪚 Produits en bois massif fabriqués localement, avec passion",
              "📈 Augmentez l'attractivité de votre location grâce à un décor soigné",
            ],
          },
          {
            p: "🎁 Offre exclusive : obtenez 5 $ de rabais sur votre première commande avec le code promo CHALETPEDIA5. Une belle façon d'embellir votre décor à petit prix !",
          },
          { h: "📩 Intéressé par nos décorations en bois ?" },
          { p: "Contactez l'équipe RUSTIK pour découvrir la collection ou commander vos pièces." },
        ],
        lienCatalogue: "https://rustikstore.bigcartel.com/",
      },
    ],
  },
  {
    slug: "entretien",
    nom: "Entretien",
    description:
      "Ménage, entretien du terrain, piscine, spa et déneigement.",
    tagline: "Garder impeccable",
    annonceCount: 2,
    image: "/images/services/entretien.webp",
    href: "/chalets/entretien/",
    listings: [
      {
        slug: "entretien-menager-chalet-mbeauchamp",
        titre: "M.Beauchamp | Spécialiste entretien ménager chalet locatif",
        localisation: "Saint-Donat-de-Montcalm, Lanaudière",
        date: "10 décembre 2024",
        numero: 1715,
        image: "/images/services/mbeauchamp.jpg",
        images: ["/images/services/mbeauchamp.jpg", "/images/services/entretien.webp"],
        carte: "Saint-Donat-de-Montcalm, Lanaudière, Québec, Canada",
        description: [
          {
            p: "M.Beauchamp entretien ménager est une équipe ponctuelle et professionnelle qui se spécialise en chalet locatif depuis bientôt deux ans. Nos services seront à la hauteur de vos attentes.",
          },
          { h: "Services offerts" },
          {
            ul: [
              "Entretien ménager chalet locatif",
              "Entretien ménager résidentiel",
              "Chantier après construction",
              "Nettoyage de fenêtre intérieur et extérieur",
            ],
          },
          { h: "Coordonnées" },
          {
            ul: [
              "michelle.beauchamp87@gmail.com",
              "(514) 869-7841",
              "290 Avenue du Lac, Saint-Donat-de-Montcalm, J0T 2C0",
            ],
          },
        ],
      },
      {
        slug: "jessa-clean-service-dentretien-menager",
        titre: "Jess'a Clean | Service d'entretien ménager",
        localisation: "Saint-Jean-sur-Richelieu, Montérégie",
        date: "10 décembre 2024",
        numero: 1713,
        image: "/images/services/jessa-clean.jpg",
        images: ["/images/services/jessa-clean.jpg", "/images/services/entretien.webp"],
        carte: "Saint-Jean-sur-Richelieu, Montérégie, Québec, Canada",
        description: [
          {
            p: "Services d'entretien ménager résidentiel et commercial. Services minutieux et professionnels.",
          },
          { h: "Coordonnées" },
          {
            ul: [
              "Babylove199@hotmail.com",
              "(514) 927-9370",
              "345 Avenue Lareau, Saint-Jean-sur-Richelieu, J2X 4Y4",
            ],
          },
        ],
      },
    ],
  },
  {
    slug: "multimedia",
    nom: "Multimédia",
    description:
      "Photographie, vidéos et captation par drone pour vos chalets.",
    tagline: "Mettre en valeur",
    annonceCount: 1,
    image: "/images/services/multimedia.webp",
    href: "/chalets/multimedia/",
    listings: [
      {
        slug: "photographie-aerienne-de-chalet-sylvain-gen-drone",
        titre: "Photographie Aérienne de Chalet | Sylvain Gen-DRONE",
        localisation: "Québec, Québec, Canada",
        date: "5 septembre 2025",
        numero: 3876,
        image: "/images/services/drone-dji-0014.jpg",
        images: [
          "/images/services/drone-dji-0014.jpg",
          "/images/services/drone-dji-0443.jpg",
          "/images/services/drone-dji-0750.jpg",
          "/images/services/drone-ste-croix.jpg",
        ],
        carte: "Québec, Québec, Canada",
        description: [
          {
            p: "Vous souhaitez mettre en valeur votre chalet ou votre secteur avec des images spectaculaires ? Offrez-vous des photos et vidéos aériennes à couper le souffle, idéales pour la promotion locative ou la vente.",
          },
          { h: "Services proposés" },
          {
            ul: [
              "Captation aérienne professionnelle par pilote certifié de drone avancé",
              "Montage vidéo complet",
              "Inclus : 10 photos aériennes",
            ],
          },
          { h: "Tarif" },
          { p: "375 $ (taxes et transport inclus)", bold: true },
          {
            p: "📞 Pour réserver ou plus d'informations : 581-909-6061",
          },
          {
            p: "🌐 Découvrez mes réalisations sur YouTube : Sylvain Gen-DRONE",
          },
          {
            p: "Mettez en valeur votre propriété et attirez plus de clients grâce à des images professionnelles et uniques !",
          },
        ],
      },
    ],
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

export function getCategoryListings(categorySlug) {
  const cat = getCategoryBySlug(categorySlug);
  return cat?.listings ?? [];
}

export function getListing(categorySlug, listingSlug) {
  const cat = getCategoryBySlug(categorySlug);
  if (!cat || !cat.listings) return null;
  const listing = cat.listings.find((l) => l.slug === listingSlug);
  if (!listing) return null;
  return { ...listing, categorieSlug: cat.slug, categorieNom: cat.nom };
}

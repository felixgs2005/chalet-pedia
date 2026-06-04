/** Normalise un document Firestore vers le format attendu par les composants React. */

function pick(data, ...keys) {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) return data[key];
  }
  return undefined;
}

export function mapChaletDoc(id, data) {
  return {
    id: pick(data, "slug") ?? id,
    slug: pick(data, "slug") ?? id,
    nom: data.nom ?? "",
    sousTitre: pick(data, "sous_titre", "sousTitre") ?? "",
    region: data.region ?? "",
    regionLabel: pick(data, "region_label", "regionLabel") ?? "",
    localisation: data.localisation ?? "",
    invites: data.invites ?? null,
    chambres: data.chambres ?? null,
    sdb: data.sdb ?? null,
    prixNuit:
      data.prix_nuit != null
        ? Number(data.prix_nuit)
        : data.prixNuit != null
          ? Number(data.prixNuit)
          : null,
    badge: data.badge ?? "",
    dateAjout: pick(data, "date_ajout", "dateAjout") ?? "",
    description: data.description ?? "",
    descriptionEn: pick(data, "description_en", "descriptionEn") ?? "",
    caracteristiques: data.features ?? data.caracteristiques ?? [],
    tags: data.tags ?? [],
    proprietaire: data.proprietaire ?? {},
    citq: data.citq ?? "",
    coordonnees: data.coordonnees ?? null,
    images: data.images ?? [],
    isFavori: false,
    _firestoreId: id,
  };
}

export function mapVenteDoc(id, data) {
  return {
    id: data.id ?? id,
    slug: pick(data, "slug") ?? id,
    region: data.region ?? "",
    regionBadge: pick(data, "region_badge", "regionBadge") ?? "",
    nom: data.nom ?? "",
    titre: data.titre ?? "",
    localisation: data.localisation ?? "",
    chambres: data.chambres ?? null,
    sdb: data.sdb ?? null,
    garages: data.garages ?? null,
    etages: data.etages ?? null,
    prix: data.prix ?? "",
    annonceId: pick(data, "annonce_id", "annonceId") ?? "",
    cardImage: pick(data, "card_image", "cardImage") ?? "",
    descriptionTitre: pick(data, "description_titre", "descriptionTitre") ?? "",
    descriptionHtml: pick(data, "description_html", "descriptionHtml") ?? "",
    images: data.images ?? [],
    features: data.features ?? [],
    priceFeatures: pick(data, "price_features", "priceFeatures") ?? [],
    _firestoreId: id,
  };
}

export function mapServiceListingDoc(id, data, category) {
  return {
    slug: pick(data, "slug") ?? id,
    titre: data.titre ?? "",
    localisation: data.localisation ?? "",
    date: data.date ?? "",
    numero: data.numero != null ? String(data.numero) : "",
    image: data.image ?? "",
    images: data.images ?? [],
    carte: data.carte ?? data.localisation ?? "",
    description: data.description ?? [],
    accroche: data.accroche ?? "",
    intro: data.intro ?? "",
    services: data.services ?? null,
    categorieSlug: category?.slug,
    categorieNom: category?.nom,
    _firestoreId: id,
  };
}

export function mapServiceCategoryDoc(id, data, listings = []) {
  return {
    slug: pick(data, "slug") ?? id,
    nom: data.nom ?? "",
    description: data.description ?? "",
    tagline: data.tagline ?? "",
    image: pick(data, "image_hero", "image") ?? "",
    href: data.href ?? `/chalets/${pick(data, "slug") ?? id}/`,
    sort_order: data.sort_order ?? 0,
    annonceCount: listings.length,
    listings,
    _firestoreId: id,
  };
}

export function mapArticleDoc(id, data) {
  return {
    id: data.id ?? id,
    slug: pick(data, "slug") ?? id,
    section: data.section ?? "blogue",
    filtre: data.filtre ?? "",
    tag: data.tag ?? "",
    categorie: data.categorie ?? "",
    partner: Boolean(data.partner),
    featured: Boolean(data.featured),
    titre: data.titre ?? "",
    excerpt: data.excerpt ?? "",
    image: data.image ?? "",
    date: data.date ?? "",
    dateFull: pick(data, "date_full", "dateFull") ?? data.date ?? "",
    lecture: data.lecture ?? "",
    lectureFull: pick(data, "lecture_full", "lectureFull") ?? "",
    auteur: data.auteur ?? "",
    auteurInitiales: pick(data, "auteur_initiales", "auteurInitiales") ?? "",
    badge: data.badge ?? "",
    badgeType: pick(data, "badge_type", "badgeType") ?? "",
    breadcrumb: data.breadcrumb ?? "",
    heroImage: pick(data, "hero_image", "heroImage") ?? data.image ?? "",
    heroAlt: pick(data, "hero_alt", "heroAlt") ?? "",
    heroCaption: pick(data, "hero_caption", "heroCaption") ?? "",
    contenuHtml: pick(data, "contenu_html", "contenuHtml") ?? "",
    tags: data.tags ?? [],
  };
}

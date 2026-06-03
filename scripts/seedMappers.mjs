/** Mappe src/data/*.js vers le modèle Firestore du plan Word. */

const BASE_EQUIPEMENTS = [
  { nom: "Wifi", categorie: "intérieur" },
  { nom: "Spa", categorie: "extérieur" },
  { nom: "Piscine", categorie: "extérieur" },
  { nom: "BBQ", categorie: "extérieur" },
  { nom: "Quai", categorie: "extérieur" },
  { nom: "Foyer", categorie: "intérieur" },
  { nom: "Animaux acceptés", categorie: "service" },
];

function equipementId(nom) {
  return nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function categorizeEquipement(nom) {
  const lower = nom.toLowerCase();
  if (/(spa|piscine|bbq|quai|terrasse|lac|plage|vue|ski|nature|bois|cabane|fjord)/.test(lower)) {
    return "extérieur";
  }
  if (/(wifi|foyer|billard|poker|cuisine|domotique|salon|chambre)/.test(lower)) {
    return "intérieur";
  }
  return "service";
}

export function buildEquipementsReferentiel(chalets) {
  const map = new Map(BASE_EQUIPEMENTS.map((eq) => [equipementId(eq.nom), eq]));

  for (const chalet of chalets) {
    for (const nom of chalet.caracteristiques || []) {
      const id = equipementId(nom);
      if (!map.has(id)) {
        map.set(id, { nom, categorie: categorizeEquipement(nom) });
      }
    }
  }

  return [...map.entries()].map(([id, data]) => ({ id, ...data }));
}

export function slugifyOwnerId(proprietaire) {
  const label = proprietaire?.nom || proprietaire?.initiales || "proprietaire";
  return `user-${label
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;
}

export function mapProprietaireToUser(proprietaire, createdAt) {
  const raw = (proprietaire?.nom || "Propriétaire").trim();
  const parts = raw.split(/\s+/);
  const prenom = parts[0]?.replace(/\.$/, "") || "Propriétaire";
  const nom = parts.length > 1 ? parts.slice(1).join(" ") : raw;

  return {
    id: slugifyOwnerId(proprietaire),
    data: {
      nom,
      prenom,
      courriel: "",
      telephone: "",
      photoProfil: "",
      role: "Propriétaire",
      initiales: proprietaire?.initiales || "",
      membre: proprietaire?.membre || "",
      dateInscription: createdAt,
    },
  };
}

export function collectProprietaires(chalets, createdAt) {
  const owners = new Map();

  for (const chalet of chalets) {
    if (!chalet.proprietaire) continue;
    const mapped = mapProprietaireToUser(chalet.proprietaire, createdAt);
    owners.set(mapped.id, mapped.data);
  }

  if (!owners.size) {
    owners.set("user-proprietaire-default", {
      nom: "ChaletPedia",
      prenom: "Admin",
      courriel: "admin@chaletpedia.com",
      telephone: "",
      photoProfil: "",
      role: "Admin",
      dateInscription: createdAt,
    });
  }

  return owners;
}

export function mapChaletToFirestore(chalet, proprietaireId, createdAt) {
  return {
    nom: chalet.nom,
    slug: chalet.slug || chalet.id,
    description: chalet.description || "",
    adresse: chalet.localisation || "",
    region: chalet.regionLabel || chalet.region || "",
    prixParNuit: chalet.prixNuit ?? null,
    nombrePersonnes: chalet.invites ?? null,
    nombreChambres: chalet.chambres ?? null,
    nombreSallesBain: chalet.sdb ?? null,
    note: 0,
    nombreAvis: 0,
    citq: chalet.citq || "",
    telephoneContact: "",
    courrielContact: "",
    proprietaireId,
    statut: "Publié",
    images: chalet.images?.length ? chalet.images : [],
    equipements: chalet.caracteristiques || [],
    tags: chalet.tags?.length ? chalet.tags : chalet.activites || [],
    coordonnees: chalet.coordonnees || null,
    dateCreation: createdAt,
    sourceId: chalet.id,
    sousTitre: chalet.sousTitre || "",
    badge: chalet.badge || "",
    dateAjout: chalet.dateAjout || "",
    isFavori: Boolean(chalet.isFavori),
  };
}

export function mapVenteToFirestore(vente, proprietaireId, createdAt) {
  const images = vente.images?.length
    ? vente.images
    : vente.cardImage
      ? [vente.cardImage]
      : [];

  return {
    titre: vente.titre || vente.nom,
    slug: vente.slug,
    nom: vente.nom,
    localisation: vente.localisation,
    region: vente.region,
    prix: vente.prix,
    nombreChambres: vente.chambres ?? null,
    nombreSallesBain: vente.sdb ?? null,
    garages: vente.garages ?? null,
    etages: vente.etages ?? null,
    annonceId: String(vente.annonceId || ""),
    descriptionTitre: vente.descriptionTitre || "",
    proprietaireId,
    statut: "Publié",
    images,
    caracteristiques: (vente.features || []).map((feature) => ({
      titre: feature.titre,
      items: feature.items || [],
    })),
    descriptionPrix: (vente.priceFeatures || []).map((item) => ({
      label: item.label,
      valeur: item.value,
    })),
    dateCreation: createdAt,
    sourceId: String(vente.id),
    descriptionHtml: vente.descriptionHtml || "",
    regionBadge: vente.regionBadge || "",
  };
}

export function mapServiceCategoryToFirestore(category, createdAt) {
  return {
    slug: category.slug,
    nom: category.nom,
    description: category.description,
    tagline: category.tagline,
    imageHero: category.image,
    annonceCount: category.annonceCount ?? category.listings?.length ?? 0,
    dateCreation: createdAt,
  };
}

function normalizeServiceDescription(listing) {
  if (Array.isArray(listing.description)) {
    return listing.description.map((block) => {
      if (block.h) return { type: "titre", contenu: block.h };
      if (block.p) {
        return { type: "paragraphe", contenu: block.p, gras: Boolean(block.bold) };
      }
      if (block.ul) return { type: "liste", contenu: block.ul };
      return block;
    });
  }

  const blocks = [];
  if (listing.accroche) blocks.push({ type: "titre", contenu: listing.accroche });
  if (listing.intro) blocks.push({ type: "paragraphe", contenu: listing.intro });
  if (Array.isArray(listing.services)) {
    blocks.push({ type: "liste", contenu: listing.services });
  }
  return blocks;
}

export function mapServiceListingToFirestore(listing, createdAt) {
  const images = listing.images?.length
    ? listing.images
    : listing.image
      ? [listing.image]
      : [];

  return {
    titre: listing.titre,
    slug: listing.slug,
    localisation: listing.localisation || "",
    numero: listing.numero != null ? String(listing.numero) : "",
    carte: listing.carte || listing.localisation || "",
    datePublication: listing.date || "",
    statut: "Publié",
    images,
    description: normalizeServiceDescription(listing),
    dateCreation: createdAt,
  };
}

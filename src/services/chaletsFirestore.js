import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const ACTIVITY_TAGS = new Set(["peche", "ski"]);

function mapProprietaireFromUser(user) {
  if (!user) {
    return { initiales: "CP", nom: "Propriétaire", membre: "" };
  }

  const prenom = user.prenom || "";
  const nom = user.nom || "";

  return {
    initiales:
      user.initiales ||
      `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() ||
      "CP",
    nom: `${prenom} ${nom}`.trim() || "Propriétaire",
    membre: user.membre || "",
  };
}

/** Convertit un document Firestore (plan Word) vers le format utilisé par l'UI. */
export function mapFirestoreChalet(docSnap, proprietaireUser = null) {
  const data = docSnap.data();
  const id = data.sourceId || docSnap.id;
  const regionLabel = data.region || "";
  const tags = data.tags || [];
  const activites = tags.filter((tag) => ACTIVITY_TAGS.has(tag));

  return {
    id,
    slug: data.slug || docSnap.id,
    nom: data.nom || "",
    sousTitre: data.sousTitre || "",
    region: data.region || "",
    regionLabel,
    localisation: data.adresse || "",
    invites: data.nombrePersonnes ?? null,
    chambres: data.nombreChambres ?? null,
    sdb: data.nombreSallesBain ?? null,
    prixNuit: data.prixParNuit ?? null,
    badge: data.badge || regionLabel,
    dateAjout: data.dateAjout || "",
    isFavori: Boolean(data.isFavori),
    images: data.images?.length ? data.images : [],
    description: data.description || "",
    descriptionEn: data.descriptionEn || "",
    caracteristiques: data.equipements || [],
    tags,
    activites,
    citq: data.citq || "",
    coordonnees: data.coordonnees || null,
    note: data.note > 0 ? data.note : null,
    nbAvis: data.nombreAvis ?? 0,
    proprietaireId: data.proprietaireId || "",
    courrielContact: data.courrielContact || "",
    proprietaire: mapProprietaireFromUser(proprietaireUser),
  };
}

export async function fetchChaletsFromFirestore() {
  const snapshot = await getDocs(collection(db, "chalets"));
  return snapshot.docs.map((docSnap) => mapFirestoreChalet(docSnap));
}

async function fetchProprietaireUser(proprietaireId) {
  if (!proprietaireId) return null;
  const userSnap = await getDoc(doc(db, "users", proprietaireId));
  return userSnap.exists() ? userSnap.data() : null;
}

export async function fetchChaletBySlugFromFirestore(slug) {
  if (!slug) return null;

  const byIdSnap = await getDoc(doc(db, "chalets", slug));
  if (byIdSnap.exists()) {
    const data = byIdSnap.data();
    const owner = await fetchProprietaireUser(data.proprietaireId);
    return mapFirestoreChalet(byIdSnap, owner);
  }

  const all = await fetchChaletsFromFirestore();
  const chalet = all.find((item) => item.slug === slug);
  if (!chalet) return null;

  const owner = await fetchProprietaireUser(chalet.proprietaireId);
  return { ...chalet, proprietaire: mapProprietaireFromUser(owner) };
}

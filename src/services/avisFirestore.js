import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

/** @typedef {'chalet' | 'service'} TypeEntite */

/**
 * Cible d'un avis (lien vers le chalet ou l'annonce service).
 * @typedef {Object} AvisCible
 * @property {TypeEntite} typeEntite
 * @property {string} entiteId - Slug utilisé pour filtrer les avis
 * @property {string} entiteTitre
 * @property {string} [chaletId] - ID document Firestore chalets/
 * @property {string} [categorySlug]
 * @property {string} [listingSlug]
 */

export function mapFirestoreAvis(docSnap) {
  const data = docSnap.data();
  const u = data.utilisateur || {};
  const auteur =
    u.displayName ||
    [u.prenom, u.nom].filter(Boolean).join(" ").trim() ||
    u.email?.split("@")[0] ||
    "Utilisateur";

  return {
    id: docSnap.id,
    typeEntite: data.typeEntite,
    entiteId: data.entiteId,
    entiteTitre: data.entiteTitre || "",
    note: data.note,
    texte: data.texte || "",
    auteur,
    utilisateur: {
      uid: u.uid || "",
      email: u.email || null,
      displayName: auteur,
      prenom: u.prenom || null,
      nom: u.nom || null,
    },
    dateCreation: data.dateCreation,
  };
}

async function resolveAuteur(firebaseUser) {
  if (!firebaseUser?.uid) {
    throw new Error("Connectez-vous pour rédiger un avis.");
  }

  let prenom = "";
  let nom = "";
  const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  if (userSnap.exists()) {
    const profile = userSnap.data();
    prenom = profile.prenom || "";
    nom = profile.nom || "";
  }

  const displayName =
    `${prenom} ${nom}`.trim() ||
    firebaseUser.displayName ||
    firebaseUser.email?.split("@")[0] ||
    "Utilisateur";

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || null,
    displayName,
    prenom: prenom || null,
    nom: nom || null,
  };
}

async function resolveChaletRef(cible) {
  if (cible.chaletId) {
    const byId = doc(db, "chalets", cible.chaletId);
    if ((await getDoc(byId)).exists()) return byId;
  }
  const bySlug = doc(db, "chalets", cible.entiteId);
  if ((await getDoc(bySlug)).exists()) return bySlug;

  const snapshot = await getDocs(collection(db, "chalets"));
  const found = snapshot.docs.find(
    (d) => d.data().slug === cible.entiteId || d.id === cible.entiteId
  );
  return found?.ref ?? null;
}

async function fetchAvisDocsForCible(typeEntite, entiteId) {
  const q = query(
    collection(db, "avis"),
    where("typeEntite", "==", typeEntite),
    where("entiteId", "==", entiteId),
    where("statut", "==", "publié")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

async function syncEntiteAvisStats(cible) {
  const avisDocs = await fetchAvisDocsForCible(cible.typeEntite, cible.entiteId);
  const nombreAvis = avisDocs.length;
  const note =
    nombreAvis > 0
      ? Math.round(
          (avisDocs.reduce((sum, a) => sum + (a.note || 0), 0) / nombreAvis) * 10
        ) / 10
      : 0;

  if (cible.typeEntite === "chalet") {
    const chaletRef = await resolveChaletRef(cible);
    if (chaletRef) {
      await updateDoc(chaletRef, { nombreAvis, note });
    }
    return;
  }

  if (cible.typeEntite === "service" && cible.categorySlug && cible.listingSlug) {
    const listingRef = doc(
      db,
      "categorieServices",
      cible.categorySlug,
      "annoncesService",
      cible.listingSlug
    );
    if ((await getDoc(listingRef)).exists()) {
      await updateDoc(listingRef, { nombreAvis, note });
    }
  }
}

/** Enregistre un avis dans la collection racine `avis` et met à jour la fiche liée. */
export async function submitAvis(cible, { note, texte, utilisateur }) {
  if (!cible?.typeEntite || !cible?.entiteId) {
    throw new Error("Annonce introuvable.");
  }
  if (!note || note < 1 || note > 5) {
    throw new Error("Veuillez choisir une note entre 1 et 5 étoiles.");
  }
  const trimmed = texte?.trim();
  if (!trimmed) {
    throw new Error("Veuillez rédiger votre avis.");
  }

  const auteur = await resolveAuteur(utilisateur);

  await addDoc(collection(db, "avis"), {
    typeEntite: cible.typeEntite,
    entiteId: cible.entiteId,
    entiteTitre: cible.entiteTitre || "",
    chaletId: cible.chaletId || null,
    categorySlug: cible.categorySlug || null,
    listingSlug: cible.listingSlug || null,
    note,
    texte: trimmed,
    utilisateur: auteur,
    statut: "publié",
    dateCreation: serverTimestamp(),
  });

  await syncEntiteAvisStats(cible);
}

/** Liste les avis publiés pour une entité (chalet ou service). */
export async function fetchAvisForEntite(typeEntite, entiteId) {
  if (!typeEntite || !entiteId) return [];

  const q = query(
    collection(db, "avis"),
    where("typeEntite", "==", typeEntite),
    where("entiteId", "==", entiteId),
    where("statut", "==", "publié")
  );
  const snapshot = await getDocs(q);
  const avis = snapshot.docs.map(mapFirestoreAvis);
  avis.sort((a, b) => {
    const ta = a.dateCreation?.toMillis?.() ?? 0;
    const tb = b.dateCreation?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return avis;
}

/** Construit la cible avis pour une fiche chalet. */
export function buildChaletAvisCible(chalet) {
  if (!chalet) return null;
  return {
    typeEntite: "chalet",
    entiteId: chalet.slug,
    entiteTitre: chalet.nom,
    chaletId: chalet.id,
  };
}

/** Construit la cible avis pour une annonce service. */
export function buildServiceAvisCible(listing) {
  if (!listing?.categorieSlug || !listing?.slug) return null;
  return {
    typeEntite: "service",
    entiteId: listing.slug,
    entiteTitre: listing.titre,
    categorySlug: listing.categorieSlug,
    listingSlug: listing.slug,
  };
}

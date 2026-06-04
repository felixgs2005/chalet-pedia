import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { resolveUtilisateur } from "../utils/resolveUtilisateur";

function favoriDocId(utilisateurUid, typeEntite, entiteId) {
  return `${utilisateurUid}_${typeEntite}_${entiteId}`;
}

export function mapFirestoreFavori(docSnap) {
  const data = docSnap.data();
  const u = data.utilisateur || {};
  return {
    id: docSnap.id,
    typeEntite: data.typeEntite,
    entiteId: data.entiteId,
    entiteTitre: data.entiteTitre || "",
    entiteUrl: data.entiteUrl || "",
    image: data.image || "",
    localisation: data.localisation || "",
    auteur: u.displayName || "Utilisateur",
    utilisateur: {
      uid: u.uid || "",
      displayName: u.displayName || "Utilisateur",
    },
    dateAjout: data.dateAjout,
  };
}

export function buildChaletFavoriCible(chalet) {
  if (!chalet) return null;
  return {
    typeEntite: "chalet",
    entiteId: chalet.slug,
    entiteTitre: chalet.nom,
    entiteUrl: `/chalet/${chalet.slug}`,
    image: chalet.images?.[0] || "",
    localisation: chalet.localisation || "",
  };
}

export function buildServiceFavoriCible(listing) {
  if (!listing?.categorieSlug || !listing?.slug) return null;
  return {
    typeEntite: "service",
    entiteId: listing.slug,
    entiteTitre: listing.titre,
    entiteUrl: `/chalets/${listing.categorieSlug}/${listing.slug}`,
    image: listing.image || listing.images?.[0] || "",
    localisation: listing.localisation || "",
    categorySlug: listing.categorieSlug,
    listingSlug: listing.slug,
  };
}

export function buildVenteFavoriCible(vente) {
  if (!vente?.slug) return null;
  return {
    typeEntite: "vente",
    entiteId: vente.slug,
    entiteTitre: vente.titre || vente.nom,
    entiteUrl: `/chalets/chalets-a-vendre/${vente.slug}`,
    image: vente.cardImage || vente.images?.[0] || "",
    localisation: vente.localisation || "",
  };
}

export async function addFavori(cible, utilisateur) {
  const user = await resolveUtilisateur(utilisateur);
  const ref = doc(db, "favoris", favoriDocId(user.uid, cible.typeEntite, cible.entiteId));

  await setDoc(ref, {
    utilisateur: user,
    typeEntite: cible.typeEntite,
    entiteId: cible.entiteId,
    entiteTitre: cible.entiteTitre || "",
    entiteUrl: cible.entiteUrl || "",
    image: cible.image || "",
    localisation: cible.localisation || "",
    categorySlug: cible.categorySlug || null,
    listingSlug: cible.listingSlug || null,
    dateAjout: serverTimestamp(),
  });

  return ref.id;
}

export async function removeFavori(utilisateurUid, typeEntite, entiteId) {
  if (!utilisateurUid || !typeEntite || !entiteId) return;
  await deleteDoc(doc(db, "favoris", favoriDocId(utilisateurUid, typeEntite, entiteId)));
}

export async function isFavori(utilisateurUid, typeEntite, entiteId) {
  if (!utilisateurUid || !typeEntite || !entiteId) return false;
  const snap = await getDoc(doc(db, "favoris", favoriDocId(utilisateurUid, typeEntite, entiteId)));
  return snap.exists();
}

export async function fetchFavorisForUser(utilisateurUid) {
  if (!utilisateurUid) return [];

  const q = query(
    collection(db, "favoris"),
    where("utilisateur.uid", "==", utilisateurUid)
  );
  const snapshot = await getDocs(q);
  const favoris = snapshot.docs.map(mapFirestoreFavori);
  favoris.sort((a, b) => {
    const ta = a.dateAjout?.toMillis?.() ?? 0;
    const tb = b.dateAjout?.toMillis?.() ?? 0;
    return tb - ta;
  });
  return favoris;
}

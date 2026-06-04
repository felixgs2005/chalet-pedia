import { doc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { sanitizeForFirestore } from "../utils/sanitizeForFirestore";

function collectionForCategorie(categorie) {
  return categorie === "chalets-vendre" ? "ventes" : "chalets";
}

/** Enregistre une annonce chalet ou vente soumise (statut « En attente »). */
export async function submitChaletListing(categorie, payload) {
  if (!payload?.slug) {
    throw new Error("Identifiant de l'annonce requis.");
  }

  const collectionName = collectionForCategorie(categorie);
  const listingRef = doc(db, collectionName, payload.slug);

  const { dateCreation: _ignored, ...rest } = payload;
  const data = sanitizeForFirestore({
    ...rest,
    dateCreation: serverTimestamp(),
  });

  await setDoc(listingRef, data, { merge: true });

  return { id: payload.slug, path: listingRef.path, collection: collectionName };
}

/** Met à jour les URLs des photos après upload Storage. */
export async function updateChaletListingImages(categorie, slug, imageUrls) {
  if (!slug) return;

  const collectionName = collectionForCategorie(categorie);
  const listingRef = doc(db, collectionName, slug);

  await updateDoc(listingRef, { images: imageUrls });
}

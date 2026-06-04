import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/** Enregistre une annonce service soumise par un annonceur (statut « En attente »). */
export async function submitServiceListing(categorySlug, payload) {
  if (!categorySlug || !payload?.slug) {
    throw new Error("Catégorie et identifiant de l'annonce requis.");
  }

  const listingRef = doc(
    db,
    "categorieServices",
    categorySlug,
    "annoncesService",
    payload.slug
  );

  await setDoc(listingRef, {
    ...payload,
    dateCreation: serverTimestamp(),
  });

  return { id: payload.slug, path: listingRef.path };
}

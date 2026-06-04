import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

/**
 * Crée un nouveau signalement pour une annonce de service.
 * @param {object} listing - L'annonce signalée.
 * @param {string} details - La raison/les détails du signalement.
 * @param {object|null} currentUser - L'utilisateur connecté (si applicable).
 */
export async function creerSignalement(listing, details, currentUser) {
  const colRef = collection(db, "signalements");
  return await addDoc(colRef, {
    annonceId: listing.slug || "",
    annonceTitre: listing.titre || "",
    annonceCategorie: listing.categorieSlug || "",
    details: details,
    signaleurUid: currentUser ? currentUser.uid : null,
    signaleurEmail: currentUser ? currentUser.email : "anonyme",
    createdAt: serverTimestamp(),
    statut: "nouveau",
  });
}

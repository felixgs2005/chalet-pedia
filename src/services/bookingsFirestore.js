import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Crée une réservation de visite privée.
 * @param {Object} bookingData - Les données de la réservation.
 * @param {string} bookingData.chaletSlug - Slug du chalet.
 * @param {string} bookingData.chaletId - Id du document chalet.
 * @param {string} bookingData.userUid - UID de l'utilisateur.
 * @param {string} bookingData.userEmail - Email de l'utilisateur.
 * @param {string} bookingData.dateVisite - Date de la visite au format YYYY-MM-DD.
 * @param {number} bookingData.nbInvites - Nombre d'invités (min 1).
 * @param {string} [bookingData.notes] - Notes optionnelles.
 */
export async function createBooking(bookingData) {
  const {
    chaletSlug,
    chaletId,
    userUid,
    userEmail,
    dateVisite,
    nbInvites,
    notes = "",
  } = bookingData;

  if (!userUid) {
    throw new Error("Utilisateur non authentifié");
  }
  if (!chaletId) {
    throw new Error("Chalet ID manquant");
  }
  if (!dateVisite) {
    throw new Error("Date de visite requise");
  }
  if (nbInvites < 1) {
    throw new Error("Le nombre d'invités doit être au moins 1");
  }

  const docRef = await addDoc(collection(db, "bookings"), {
    chaletSlug,
    chaletId,
    userUid,
    userEmail,
    dateVisite,
    // store a timestamp version of the visit date for security rules and comparisons
    dateVisiteTs: new Date(dateVisite + "T00:00:00"),
    nbInvites,
    notes,
    statut: "en_attente",
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Récupère les réservations d'un utilisateur.
 * @param {string} uid - UID de l'utilisateur.
 * @returns {Promise<Array>} Liste des réservations.
 */
export async function fetchBookingsForUser(uid) {
  if (!uid) return [];
  const q = query(collection(db, "bookings"), where("userUid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/**
 * Supprime une réservation (efface le document).
 * @param {string} bookingId
 */
export async function deleteBooking(bookingId) {
  if (!bookingId) throw new Error("bookingId requis");
  const d = doc(db, "bookings", bookingId);
  await deleteDoc(d);
}

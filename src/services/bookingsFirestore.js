import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, doc, getDoc } from "firebase/firestore";
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
    typeEntite = "chalet",
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
    typeEntite,
    userUid,
    userEmail,
    dateVisite,
    // store a timestamp version of the visit date for security rules and comparisons
    dateVisiteTs: new Date(dateVisite + "T00:00:00"),
    nbInvites,
    notes,
    createdAt: serverTimestamp(),
  });
  // After creating the booking, also create a listingContactMessages document
  // so a Cloud Function can email the owner with the booking details.
  // We attempt to enrich with user profile (name, telephone) if available.
  async function _notifyOwner() {
    try {
      let nom = "Utilisateur";
      let telephone = "Non fourni";
      let proprietaireId = null;
      let courrielContact = null;

      if (userUid) {
        try {
          const userSnap = await getDoc(doc(db, "users", userUid));
          if (userSnap.exists()) {
            const data = userSnap.data() || {};
            if (data.prenom || data.nom) nom = `${data.prenom || ""} ${data.nom || ""}`.trim();
            if (data.telephone) telephone = String(data.telephone);
            if (data.displayName) nom = data.displayName;
          }
        } catch (err) {
          // ignore profile fetch errors
        }
      }

      // Try to fetch the listing document (chalets or ventes) based on typeEntite
      let listingDoc = null;
      if (chaletId) {
        try {
          if (typeEntite === "vente") {
            const venteSnap = await getDoc(doc(db, "ventes", chaletId));
            if (venteSnap.exists()) listingDoc = venteSnap;
            else {
              // try by slug
              const q = query(collection(db, "ventes"), where("slug", "==", chaletId));
              const r = await getDocs(q);
              if (!r.empty) listingDoc = r.docs[0];
            }
          } else {
            const chaletSnap = await getDoc(doc(db, "chalets", chaletId));
            if (chaletSnap.exists()) listingDoc = chaletSnap;
            else {
              const q = query(collection(db, "chalets"), where("slug", "==", chaletId));
              const r = await getDocs(q);
              if (!r.empty) listingDoc = r.docs[0];
            }
          }

          if (listingDoc && listingDoc.exists()) {
            const cdata = listingDoc.data() || {};
            proprietaireId = cdata.proprietaireId || null;
            courrielContact = cdata.courrielContact || null;
            // prefer readable title if available
            if (cdata.titre || cdata.nom) {
              // use vente.titre or chalet.nom
            }
          }
        } catch (err) {
          // ignore
        }
      }

      const message = [
        `Demande de visite pour l'annonce: ${chaletSlug}`,
        `Date: ${dateVisite}`,
        `Invités: ${nbInvites}`,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      // Build canonical entity URL depending on typeEntite
      let entiteUrl = "";
      let entiteTitre = chaletSlug || "votre annonce";
      if (typeEntite === "vente") {
        entiteUrl = `/chalets/chalets-a-vendre/${chaletSlug}`;
      } else {
        // default to the single-chalet route which exists in App routes
        entiteUrl = `/chalet/${chaletSlug}`;
      }
      // If we have a listingDoc, try to use a nicer title
      if (listingDoc && listingDoc.exists()) {
        const ld = listingDoc.data() || {};
        entiteTitre = ld.titre || ld.nom || entiteTitre;
      }

      const payload = {
        nom,
        email: userEmail || "",
        telephone,
        message,
        consentement: true,
        typeEntite: typeEntite || "chalet",
        entiteId: chaletId || chaletSlug,
        entiteTitre,
        entiteUrl,
        proprietaireId,
        destinataireEmail: courrielContact || null,
      };

      // Create the contact message document synchronously so we can be sure
      // the Cloud Function trigger will run. If this fails, log and continue.
      const contactRef = await addDoc(collection(db, "listingContactMessages"), payload);
      console.log("listingContactMessages created:", contactRef.id);
    } catch (err) {
      // don't fail booking creation if notify fails
      console.error("notifyOwner error:", err);
    }
  }
  // Trigger notification asynchronously (don't block booking creation)
  _notifyOwner().catch((e) => console.error(e));

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

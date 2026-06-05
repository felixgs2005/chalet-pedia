import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Crée un document Firestore — la Cloud Function onContactMessageCreated envoie le courriel.
 * Champs alignés sur buildContactMessageDocument dans functions/SendEmail.js
 */
export async function submitContactForm({ nom, email, sujet, message, consentement }) {
  const ref = await addDoc(collection(db, "contactMessages"), {
    nom: String(nom || "").trim(),
    email: String(email || "").trim(),
    sujet: String(sujet || "autre"),
    message: String(message || "").trim(),
    consentement: Boolean(consentement),
    statut: "en_attente",
    dateCreation: serverTimestamp(),
  });
  return { id: ref.id };
}

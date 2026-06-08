import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Crée un document Firestore — la Cloud Function onContactMessageCreated envoie le courriel.
 * Champs alignés sur buildContactMessageDocument dans functions/SendEmail.js
 */
export async function submitContactForm({
  nom,
  email,
  sujet,
  message,
  consentement,
  telephone,
}) {
  const payload = {
    nom: String(nom || "").trim(),
    email: String(email || "").trim(),
    sujet: String(sujet || "autre"),
    message: String(message || "").trim(),
    consentement: Boolean(consentement),
    statut: "en_attente",
    dateCreation: serverTimestamp(),
  };
  const tel = String(telephone || "").trim();
  if (tel) payload.telephone = tel;

  const ref = await addDoc(collection(db, "contactMessages"), payload);
  return { id: ref.id };
}

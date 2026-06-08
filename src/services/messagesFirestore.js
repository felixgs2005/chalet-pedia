import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { extractEmailFromDescription } from "../utils/extractEmailFromDescription";
import { normalizeEmail } from "../utils/normalizeEmail";
import { resolveUtilisateurByUid } from "../utils/resolveUtilisateur";

export function buildChaletMessageCible(chalet) {
  if (!chalet) return null;
  return {
    typeEntite: "chalet",
    entiteId: chalet.slug,
    entiteTitre: chalet.nom,
    entiteUrl: `/chalet/${chalet.slug}`,
    destinataireUid: chalet.proprietaireId || "",
    destinataireNom: chalet.proprietaire?.nom || "Propriétaire",
    courrielContact: chalet.courrielContact || "",
  };
}

export function buildVenteMessageCible(vente) {
  if (!vente?.slug) return null;
  return {
    typeEntite: "vente",
    entiteId: vente.slug,
    entiteTitre: vente.titre || vente.nom,
    entiteUrl: `/chalets/chalets-a-vendre/${vente.slug}`,
    destinataireUid: vente.proprietaireId || "",
    destinataireNom: "Propriétaire",
    courrielContact: vente.courrielContact || "",
  };
}

export function buildServiceMessageCible(listing) {
  if (!listing?.categorieSlug || !listing?.slug) return null;
  const destinataireEmail =
    listing.courrielContact ||
    extractEmailFromDescription(listing.description) ||
    "";
  return {
    typeEntite: "service",
    entiteId: listing.slug,
    entiteTitre: listing.titre,
    entiteUrl: `/chalets/${listing.categorieSlug}/${listing.slug}`,
    categorieSlug: listing.categorieSlug,
    destinataireUid: listing.proprietaireId || "",
    destinataireNom: listing.nomEntreprise || "Annonceur",
    destinataireEmail,
    courrielContact: listing.courrielContact || "",
  };
}

/** Résout le courriel du propriétaire/annonceur (validation côté client). */
export async function resolveDestinataireEmail(cible) {
  if (!cible) return null;
  const fromCible =
    normalizeEmail(cible.destinataireEmail) ||
    normalizeEmail(cible.courrielContact);
  if (fromCible) return fromCible;
  if (cible.destinataireUid) {
    const user = await resolveUtilisateurByUid(cible.destinataireUid);
    return normalizeEmail(user.email);
  }
  return null;
}

/**
 * Crée un document Firestore — la Cloud Function onListingContactCreated envoie
 * le courriel au propriétaire via Nodemailer.
 */
export async function submitListingContactForm(
  cible,
  { nom, email, telephone, message, consentement }
) {
  if (!cible?.typeEntite || !cible?.entiteId) {
    throw new Error("Annonce introuvable.");
  }

  const trimmedMessage = String(message || "").trim();
  if (!trimmedMessage) {
    throw new Error("Veuillez écrire un message.");
  }

  const ownerEmail = await resolveDestinataireEmail(cible);
  if (!ownerEmail) {
    throw new Error("Aucun courriel de propriétaire n'est disponible pour cette annonce.");
  }

  const payload = {
    typeEntite: cible.typeEntite,
    entiteId: cible.entiteId,
    entiteTitre: cible.entiteTitre || "",
    entiteUrl: cible.entiteUrl || "",
    nom: String(nom || "").trim(),
    email: String(email || "").trim(),
    telephone: String(telephone || "").trim(),
    message: trimmedMessage,
    consentement: Boolean(consentement),
    statut: "en_attente",
    dateCreation: serverTimestamp(),
  };

  if (cible.categorieSlug) {
    payload.categorieSlug = cible.categorieSlug;
  }

  const ref = await addDoc(collection(db, "listingContactMessages"), payload);
  return { id: ref.id, toEmail: ownerEmail };
}

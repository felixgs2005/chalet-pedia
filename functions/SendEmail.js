const nodemailer = require("nodemailer");

/** Destinataire interne selon le sujet du formulaire contact. */
const RECIPIENTS_BY_SUBJECT = {
  support: "support@chaletpedia.com",
  proprietaire: "annonces@chaletpedia.com",
  partenariat: "partenariats@chaletpedia.com",
  publicite: "publicite@chaletpedia.com",
  signalement: "urgence@chaletpedia.com",
  autre: "info@chaletpedia.com",
};

const SUBJECT_LABELS = {
  support: "Support technique",
  proprietaire: "Annoncer un chalet",
  partenariat: "Demande de partenariat",
  publicite: "Publicité",
  signalement: "Signalement d'annonce",
  autre: "Autre",
};

function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "Variables SMTP_USER et SMTP_PASS manquantes (config Cloud Functions)."
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Structure du document Firestore `contactMessages` (créé côté client, envoyé par Cloud Function).
 */
function buildContactMessageDocument({ nom, email, sujet, message, consentement, telephone }) {
  const doc = {
    nom: String(nom || "").trim(),
    email: String(email || "").trim(),
    sujet: String(sujet || "autre"),
    message: String(message || "").trim(),
    consentement: Boolean(consentement),
    statut: "en_attente",
  };
  const tel = String(telephone || "").trim();
  if (tel) doc.telephone = tel;
  return doc;
}

/**
 * Envoie le courriel de contact à l'équipe ChaletPedia.
 * @param {object} contactData — document Firestore contactMessages
 */
async function sendContactEmail(contactData) {
  const nom = String(contactData.nom || "").trim();
  const email = String(contactData.email || "").trim();
  const sujet = String(contactData.sujet || "autre");
  const message = String(contactData.message || "").trim();
  const telephone = String(contactData.telephone || "").trim();

  if (!nom || !email || !message) {
    throw new Error("Document contact incomplet (nom, email, message requis).");
  }

  const to = RECIPIENTS_BY_SUBJECT[sujet] || RECIPIENTS_BY_SUBJECT.autre;
  const sujetLabel = SUBJECT_LABELS[sujet] || sujet;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const telephoneLine = telephone ? `Téléphone : ${telephone}` : "";
  const telephoneHtml = telephone
    ? `<p><strong>Téléphone :</strong> ${escapeHtml(telephone)}</p>`
    : "";

  const transporter = createTransporter();

  const mailOptions = {
    from: `"ChaletPedia Contact" <${fromAddress}>`,
    to,
    replyTo: email,
    subject: `[ChaletPedia Contact] ${sujetLabel} — ${nom}`,
    text: [
      "Nouveau message depuis le formulaire de contact",
      "",
      `Nom : ${nom}`,
      `Courriel : ${email}`,
      telephoneLine,
      `Sujet : ${sujetLabel}`,
      "",
      "Message :",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <h2>Nouveau message — formulaire contact</h2>
      <p><strong>Nom :</strong> ${escapeHtml(nom)}</p>
      <p><strong>Courriel :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      ${telephoneHtml}
      <p><strong>Sujet :</strong> ${escapeHtml(sujetLabel)}</p>
      <p><strong>Message :</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to };
}

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

async function fetchUserEmail(db, uid) {
  if (!uid) return null;
  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data();
  return normalizeEmail(data.email || data.courriel);
}

async function fetchChaletDoc(db, entiteId) {
  const direct = await db.collection("chalets").doc(entiteId).get();
  if (direct.exists) return direct;

  const bySlug = await db
    .collection("chalets")
    .where("slug", "==", entiteId)
    .limit(1)
    .get();
  return bySlug.docs[0] || null;
}

async function fetchVenteDoc(db, entiteId) {
  const direct = await db.collection("ventes").doc(entiteId).get();
  if (direct.exists) return direct;

  const bySlug = await db
    .collection("ventes")
    .where("slug", "==", entiteId)
    .limit(1)
    .get();
  return bySlug.docs[0] || null;
}

async function fetchServiceListingDoc(db, entiteId, categorieSlug) {
  if (categorieSlug) {
    const direct = await db
      .collection("categorieServices")
      .doc(categorieSlug)
      .collection("annoncesService")
      .doc(entiteId)
      .get();
    if (direct.exists) return direct;

    const bySlug = await db
      .collection("categorieServices")
      .doc(categorieSlug)
      .collection("annoncesService")
      .where("slug", "==", entiteId)
      .limit(1)
      .get();
    if (!bySlug.empty) return bySlug.docs[0];
  }

  const group = await db
    .collectionGroup("annoncesService")
    .where("slug", "==", entiteId)
    .limit(1)
    .get();
  return group.docs[0] || null;
}

/**
 * Résout le courriel du propriétaire côté serveur (Admin SDK).
 * @param {FirebaseFirestore.Firestore} db
 */
async function resolveListingOwnerEmail(db, { typeEntite, entiteId, categorieSlug }) {
  if (typeEntite === "chalet") {
    const chaletDoc = await fetchChaletDoc(db, entiteId);
    if (!chaletDoc?.exists) {
      throw new Error("Annonce introuvable.");
    }
    const data = chaletDoc.data();
    const fromListing = normalizeEmail(data.courrielContact);
    if (fromListing) return fromListing;
    const fromUser = await fetchUserEmail(db, data.proprietaireId);
    if (fromUser) return fromUser;
    throw new Error("Aucun courriel propriétaire pour cette annonce.");
  }

  if (typeEntite === "service") {
    const listingDoc = await fetchServiceListingDoc(db, entiteId, categorieSlug);
    if (!listingDoc?.exists) {
      throw new Error("Annonce introuvable.");
    }
    const data = listingDoc.data();
    const fromListing = normalizeEmail(data.courrielContact);
    if (fromListing) return fromListing;
    const fromUser = await fetchUserEmail(db, data.proprietaireId);
    if (fromUser) return fromUser;
    throw new Error("Aucun courriel propriétaire pour cette annonce.");
  }

  if (typeEntite === "vente") {
    const venteDoc = await fetchVenteDoc(db, entiteId);
    if (!venteDoc?.exists) {
      throw new Error("Annonce introuvable.");
    }
    const data = venteDoc.data();
    const fromListing = normalizeEmail(data.courrielContact);
    if (fromListing) return fromListing;
    const fromUser = await fetchUserEmail(db, data.proprietaireId);
    if (fromUser) return fromUser;
    throw new Error("Aucun courriel propriétaire pour cette annonce.");
  }

  throw new Error("Type d'annonce non pris en charge.");
}

/**
 * Envoie le message du visiteur au propriétaire/annonceur (Nodemailer).
 * @param {object} contactData — document Firestore listingContactMessages
 */
async function sendListingContactEmail(contactData) {
  const { getFirestore } = require("firebase-admin/firestore");
  const db = getFirestore();

  const nom = String(contactData.nom || "").trim();
  const email = String(contactData.email || "").trim();
  const telephone = String(contactData.telephone || "").trim();
  const message = String(contactData.message || "").trim();
  const entiteTitre = String(contactData.entiteTitre || "votre annonce");
  const entiteUrl = String(contactData.entiteUrl || "");

  if (!nom || !email || !telephone || !message) {
    throw new Error("Document incomplet (nom, email, téléphone, message requis).");
  }

  const toEmail = await resolveListingOwnerEmail(db, contactData);
  const origin = process.env.APP_ORIGIN || "https://chalet-pedia.vercel.app";
  const listingUrl = entiteUrl
    ? `${origin.replace(/\/$/, "")}${entiteUrl}`
    : origin.replace(/\/$/, "");
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ChaletPedia" <${fromAddress}>`,
    to: toEmail,
    replyTo: email,
    subject: `ChaletPedia — message pour « ${entiteTitre} »`,
    text: [
      "Bonjour,",
      "",
      `Vous avez reçu un message via ChaletPedia concernant l'annonce « ${entiteTitre} ».`,
      "",
      `Nom : ${nom}`,
      `Courriel : ${email}`,
      `Téléphone : ${telephone}`,
      "",
      "Message :",
      message,
      "",
      `Voir l'annonce : ${listingUrl}`,
      "",
      "Répondez directement à l'expéditeur en répondant à ce courriel.",
    ].join("\n"),
    html: [
      "<p>Bonjour,</p>",
      `<p>Vous avez reçu un message via <strong>ChaletPedia</strong> concernant l'annonce « <strong>${escapeHtml(entiteTitre)}</strong> ».</p>`,
      `<p><strong>Nom :</strong> ${escapeHtml(nom)}</p>`,
      `<p><strong>Courriel :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>`,
      `<p><strong>Téléphone :</strong> ${escapeHtml(telephone)}</p>`,
      "<p><strong>Message :</strong></p>",
      `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      `<p><a href="${escapeHtml(listingUrl)}">Voir l'annonce sur ChaletPedia</a></p>`,
      '<p style="color:#666;font-size:12px">Répondez directement à l\'expéditeur en répondant à ce courriel.</p>',
    ].join(""),
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to: toEmail };
}

module.exports = {
  sendContactEmail,
  sendListingContactEmail,
  buildContactMessageDocument,
  RECIPIENTS_BY_SUBJECT,
};

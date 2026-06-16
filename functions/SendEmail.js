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

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/** Courriel dans les blocs description (annonces service legacy). */
function extractEmailFromDescription(description) {
  if (!Array.isArray(description)) return null;

  for (const block of description) {
    const parts = [];
    if (typeof block === "string") {
      parts.push(block);
    } else if (block?.contenu && Array.isArray(block.contenu)) {
      parts.push(...block.contenu);
    } else if (block?.texte) {
      parts.push(block.texte);
    }

    for (const part of parts) {
      const match = String(part).match(EMAIL_RE);
      const email = normalizeEmail(match?.[0]);
      if (email) return email;
    }
  }

  return null;
}

async function fetchUserEmail(db, uid) {
  if (!uid) return null;
  const snap = await db.collection("users").doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data();
  return normalizeEmail(data.email || data.courriel);
}

const { ADMIN_EMAIL } = require("./adminEmail");

async function resolveAdminNotificationRecipients() {
  const fromEnv = normalizeEmail(process.env.ADMIN_NOTIFICATION_EMAIL);
  if (fromEnv) return fromEnv;

  return ADMIN_EMAIL;
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
    const fromDescription = extractEmailFromDescription(data.description);
    if (fromDescription) return fromDescription;
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

const LISTING_TYPE_LABELS = {
  chalet: "Chalet à louer",
  vente: "Chalet à vendre",
  service: "Service",
};

function isPendingListingStatut(statut) {
  const s = String(statut || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return s === "en attente" || s === "en_attente" || s === "pending";
}

function getListingTitle(data, fallbackId) {
  return (
    String(data.titre || data.nom || data.sousTitre || fallbackId || "").trim() ||
    fallbackId
  );
}

/**
 * Notifie l'admin qu'une nouvelle annonce attend validation.
 */
async function sendNewListingAdminEmail(listingData, meta) {
  const { getFirestore } = require("firebase-admin/firestore");
  const db = getFirestore();

  const type = String(meta.type || "").trim();
  const listingId = String(meta.listingId || "").trim();
  const categorySlug = String(meta.categorySlug || "").trim();
  const statut = listingData.statut ?? listingData.status;

  if (!isPendingListingStatut(statut)) {
    return { skipped: true, reason: "not_pending" };
  }

  const typeLabel = LISTING_TYPE_LABELS[type] || type || "Annonce";
  const titre = getListingTitle(listingData, listingId);
  const origin = process.env.APP_ORIGIN || "https://chalet-pedia.vercel.app";
  const adminUrl = `${origin.replace(/\/$/, "")}/admin/dashboard`;
  const to = await resolveAdminNotificationRecipients();
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

  let submitterEmail = normalizeEmail(listingData.courrielContact);
  if (!submitterEmail && listingData.proprietaireId) {
    submitterEmail = await fetchUserEmail(db, listingData.proprietaireId);
  }
  if (!submitterEmail) {
    submitterEmail = extractEmailFromDescription(listingData.description);
  }

  const localisation =
    listingData.localisation || listingData.adresse || listingData.region || "—";
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ChaletPedia" <${fromAddress}>`,
    to,
    subject: `[ChaletPedia] Nouvelle annonce en attente — ${titre}`,
    text: [
      "Une nouvelle annonce attend votre validation.",
      "",
      `Type : ${typeLabel}`,
      `Titre : ${titre}`,
      `Identifiant : ${listingId}`,
      categorySlug ? `Catégorie : ${categorySlug}` : "",
      `Localisation : ${localisation}`,
      submitterEmail ? `Courriel soumissionnaire : ${submitterEmail}` : "",
      `Statut : ${statut}`,
      "",
      `Gérer les annonces : ${adminUrl}`,
    ]
      .filter(Boolean)
      .join("\n"),
    html: [
      "<h2>Nouvelle annonce en attente de validation</h2>",
      `<p><strong>Type :</strong> ${escapeHtml(typeLabel)}</p>`,
      `<p><strong>Titre :</strong> ${escapeHtml(titre)}</p>`,
      `<p><strong>Identifiant :</strong> ${escapeHtml(listingId)}</p>`,
      categorySlug
        ? `<p><strong>Catégorie :</strong> ${escapeHtml(categorySlug)}</p>`
        : "",
      `<p><strong>Localisation :</strong> ${escapeHtml(localisation)}</p>`,
      submitterEmail
        ? `<p><strong>Courriel :</strong> <a href="mailto:${escapeHtml(submitterEmail)}">${escapeHtml(submitterEmail)}</a></p>`
        : "",
      `<p><strong>Statut :</strong> ${escapeHtml(String(statut))}</p>`,
      `<p><a href="${escapeHtml(adminUrl)}">Ouvrir le dashboard admin</a></p>`,
    ].join(""),
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to };
}

/**
 * Envoie le code de réinitialisation du mot de passe.
 */
async function sendPasswordResetCodeEmail({ email, code }) {
  const to = normalizeEmail(email);
  if (!to) throw new Error("Courriel invalide.");

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const origin = process.env.APP_ORIGIN || "https://chalet-pedia.vercel.app";
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ChaletPedia" <${fromAddress}>`,
    to,
    subject: "[ChaletPedia] Code de réinitialisation du mot de passe",
    text: [
      "Bonjour,",
      "",
      "Vous avez demandé à réinitialiser votre mot de passe ChaletPedia.",
      "",
      `Votre code de sécurité : ${code}`,
      "",
      "Ce code expire dans 15 minutes.",
      "Si vous n'êtes pas à l'origine de cette demande, ignorez ce courriel.",
      "",
      origin,
    ].join("\n"),
    html: [
      "<p>Bonjour,</p>",
      "<p>Vous avez demandé à réinitialiser votre mot de passe <strong>ChaletPedia</strong>.</p>",
      `<p style="font-size:28px;font-weight:700;letter-spacing:6px;margin:24px 0">${escapeHtml(code)}</p>`,
      "<p>Ce code expire dans <strong>15 minutes</strong>.</p>",
      "<p style='color:#666;font-size:12px'>Si vous n'êtes pas à l'origine de cette demande, ignorez ce courriel.</p>",
    ].join(""),
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to };
}

module.exports = {
  sendContactEmail,
  sendListingContactEmail,
  sendNewListingAdminEmail,
  sendPasswordResetCodeEmail,
  buildContactMessageDocument,
  RECIPIENTS_BY_SUBJECT,
};

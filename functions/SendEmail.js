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

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

/**
 * Structure du document Firestore `contactMessages` (créé côté client, envoyé par Cloud Function).
 */
function buildContactMessageDocument({ nom, email, sujet, message, consentement }) {
  return {
    nom: String(nom || "").trim(),
    email: String(email || "").trim(),
    sujet: String(sujet || "autre"),
    message: String(message || "").trim(),
    consentement: Boolean(consentement),
    statut: "en_attente",
  };
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

  if (!nom || !email || !message) {
    throw new Error("Document contact incomplet (nom, email, message requis).");
  }

  const to = RECIPIENTS_BY_SUBJECT[sujet] || RECIPIENTS_BY_SUBJECT.autre;
  const sujetLabel = SUBJECT_LABELS[sujet] || sujet;
  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;

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
      `Sujet : ${sujetLabel}`,
      "",
      "Message :",
      message,
    ].join("\n"),
    html: `
      <h2>Nouveau message — formulaire contact</h2>
      <p><strong>Nom :</strong> ${escapeHtml(nom)}</p>
      <p><strong>Courriel :</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
      <p><strong>Sujet :</strong> ${escapeHtml(sujetLabel)}</p>
      <p><strong>Message :</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to };
}

/**
 * Notifie l'annonceur par courriel (message interne déjà enregistré dans `messages`).
 * @param {object} messageData — document Firestore messages
 */
async function sendAdvertiserEmail(messageData) {
  const destinataire = messageData.destinataire || {};
  const expediteur = messageData.expediteur || {};
  const toEmail = normalizeEmail(destinataire.email);

  if (!toEmail) {
    return { skipped: true, reason: "no_advertiser_email" };
  }

  const texte = String(messageData.texte || "").trim();
  if (!texte) {
    throw new Error("Message vide.");
  }

  const entiteTitre = String(messageData.entiteTitre || "votre annonce");
  const entiteUrl = String(messageData.entiteUrl || "");
  const origin =
    process.env.APP_ORIGIN || "https://chalet-pedia.vercel.app";
  const listingUrl = `${origin.replace(/\/$/, "")}${entiteUrl}`;
  const fromLine = expediteur.displayName || "Un utilisateur ChaletPedia";
  const fromEmail = expediteur.email ? ` (${expediteur.email})` : "";
  const pieceJointeUrl = messageData.pieceJointeUrl || null;
  const pieceJointeNom = messageData.pieceJointeNom || null;

  let attachmentBlock = "";
  if (pieceJointeUrl) {
    const label = pieceJointeNom || "Pièce jointe";
    attachmentBlock = `\n\nPièce jointe : ${label}\n${pieceJointeUrl}`;
  }

  const text = [
    "Bonjour,",
    "",
    `Vous avez reçu un message via ChaletPedia concernant l'annonce « ${entiteTitre} ».`,
    "",
    `De : ${fromLine}${fromEmail}`,
    "",
    "Message :",
    texte,
    attachmentBlock,
    "",
    `Voir l'annonce : ${listingUrl}`,
    "",
    "Répondez depuis votre compte ChaletPedia (section Messages) ou par courriel si l'expéditeur a indiqué son adresse.",
  ].join("\n");

  const html = [
    "<p>Bonjour,</p>",
    `<p>Vous avez reçu un message via <strong>ChaletPedia</strong> concernant l'annonce « <strong>${escapeHtml(entiteTitre)}</strong> ».</p>`,
    `<p><strong>De :</strong> ${escapeHtml(fromLine)}${escapeHtml(fromEmail)}</p>`,
    "<p><strong>Message :</strong></p>",
    `<p style="white-space:pre-wrap">${escapeHtml(texte)}</p>`,
    pieceJointeUrl
      ? `<p><strong>Pièce jointe :</strong> <a href="${escapeHtml(pieceJointeUrl)}">${escapeHtml(pieceJointeNom || "Fichier")}</a></p>`
      : "",
    `<p><a href="${escapeHtml(listingUrl)}">Voir l'annonce sur ChaletPedia</a></p>`,
    '<p style="color:#666;font-size:12px">Répondez depuis votre compte (Messages) ou par courriel à l\'expéditeur.</p>',
  ].join("");

  const fromAddress = process.env.SMTP_FROM || process.env.SMTP_USER;
  const transporter = createTransporter();

  const mailOptions = {
    from: `"ChaletPedia" <${fromAddress}>`,
    to: toEmail,
    replyTo: normalizeEmail(expediteur.email) || undefined,
    subject: `ChaletPedia — message pour « ${entiteTitre} »`,
    text,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  return { messageId: info.messageId, to: toEmail, skipped: false };
}

module.exports = {
  sendContactEmail,
  sendAdvertiserEmail,
  buildContactMessageDocument,
  RECIPIENTS_BY_SUBJECT,
};

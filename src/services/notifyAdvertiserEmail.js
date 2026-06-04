import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { normalizeEmail } from "../utils/normalizeEmail";

const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

export function isEmailJsConfigured() {
  return Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);
}

/** Indique si un envoi réel de courriel est possible (EmailJS ou extension Firebase sur `mail`). */
export function isAdvertiserEmailDeliveryConfigured() {
  return isEmailJsConfigured();
}

export function resolveAdvertiserEmail(destinataire, cible) {
  return (
    normalizeEmail(destinataire?.email) ||
    normalizeEmail(cible?.destinataireEmail) ||
    null
  );
}

function buildEmailBodies({ expediteur, cible, texte, pieceJointeUrl, pieceJointeNom }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://chalet-pedia.vercel.app";
  const listingUrl = `${origin}${cible.entiteUrl || ""}`;
  const fromLine = expediteur.displayName || "Un utilisateur ChaletPedia";
  const fromEmail = expediteur.email ? ` (${expediteur.email})` : "";

  let attachmentBlock = "";
  if (pieceJointeUrl) {
    const label = pieceJointeNom || "Pièce jointe";
    attachmentBlock = `\n\nPièce jointe : ${label}\n${pieceJointeUrl}`;
  }

  const text = [
    `Bonjour,`,
    ``,
    `Vous avez reçu un message via ChaletPedia concernant l'annonce « ${cible.entiteTitre || "votre annonce"} ».`,
    ``,
    `De : ${fromLine}${fromEmail}`,
    ``,
    `Message :`,
    texte,
    attachmentBlock,
    ``,
    `Voir l'annonce : ${listingUrl}`,
    ``,
    `Répondez à ce message depuis votre compte ChaletPedia (section Messages) ou par courriel si l'expéditeur a indiqué son adresse.`,
  ].join("\n");

  const html = [
    `<p>Bonjour,</p>`,
    `<p>Vous avez reçu un message via <strong>ChaletPedia</strong> concernant l'annonce « <strong>${escapeHtml(cible.entiteTitre || "votre annonce")}</strong> ».</p>`,
    `<p><strong>De :</strong> ${escapeHtml(fromLine)}${escapeHtml(fromEmail)}</p>`,
    `<p><strong>Message :</strong></p>`,
    `<p style="white-space:pre-wrap">${escapeHtml(texte)}</p>`,
    pieceJointeUrl
      ? `<p><strong>Pièce jointe :</strong> <a href="${escapeHtml(pieceJointeUrl)}">${escapeHtml(pieceJointeNom || "Fichier")}</a></p>`
      : "",
    `<p><a href="${escapeHtml(listingUrl)}">Voir l'annonce sur ChaletPedia</a></p>`,
    `<p style="color:#666;font-size:12px">Répondez depuis votre compte (Messages) ou par courriel à l'expéditeur.</p>`,
  ].join("");

  return {
    subject: `ChaletPedia — message pour « ${cible.entiteTitre || "votre annonce"} »`,
    text,
    html,
    listingUrl,
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** File d'attente pour l'extension Firebase « Trigger Email from Firestore » (collection `mail`). */
async function queueFirestoreEmail(toEmail, message) {
  await addDoc(collection(db, "mail"), {
    to: [toEmail],
    message: {
      subject: message.subject,
      text: message.text,
      html: message.html,
    },
  });
}

/** Envoi via EmailJS (https://www.emailjs.com/) si les variables REACT_APP_EMAILJS_* sont définies. */
async function sendViaEmailJs(toEmail, { expediteur, cible, texte, pieceJointeUrl, pieceJointeNom, bodies }) {
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: toEmail,
        subject: bodies.subject,
        message: bodies.text,
        from_name: expediteur.displayName || "Utilisateur ChaletPedia",
        from_email: expediteur.email || "",
        listing_title: cible.entiteTitre || "",
        listing_url: bodies.listingUrl,
        attachment_url: pieceJointeUrl || "",
        attachment_name: pieceJointeNom || "",
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `EmailJS (${response.status})`);
  }
}

/**
 * Notifie l'annonceur par courriel (en plus du message Firestore).
 * Ne lève pas d'erreur bloquante : l'échec d'e-mail n'annule pas le message interne.
 */
export async function notifyAdvertiserByEmail({
  destinataire,
  cible,
  expediteur,
  texte,
  pieceJointeUrl,
  pieceJointeNom,
}) {
  const toEmail = resolveAdvertiserEmail(destinataire, cible);
  if (!toEmail) {
    return { sent: false, reason: "no_advertiser_email", toEmail: null };
  }

  const bodies = buildEmailBodies({
    expediteur,
    cible,
    texte,
    pieceJointeUrl,
    pieceJointeNom,
  });

  let firestoreQueued = false;
  let emailJsSent = false;
  let lastError = null;

  try {
    await queueFirestoreEmail(toEmail, bodies);
    firestoreQueued = true;
  } catch (err) {
    lastError = err;
  }

  if (isEmailJsConfigured()) {
    try {
      await sendViaEmailJs(toEmail, {
        expediteur,
        cible,
        texte,
        pieceJointeUrl,
        pieceJointeNom,
        bodies,
      });
      emailJsSent = true;
    } catch (err) {
      lastError = err;
    }
  }

  const delivered = emailJsSent;
  const queuedOnly = firestoreQueued && !emailJsSent;

  if (!delivered && !firestoreQueued) {
    return {
      sent: false,
      toEmail,
      reason: "send_failed",
      error: lastError?.message || "Impossible d'envoyer le courriel.",
      firestoreQueued: false,
      emailJsSent: false,
      needsEmailJs: !isEmailJsConfigured(),
    };
  }

  return {
    sent: delivered,
    toEmail,
    firestoreQueued,
    emailJsSent,
    queuedOnly,
    needsExtension: queuedOnly && !isEmailJsConfigured(),
    needsEmailJs: !isEmailJsConfigured() && !firestoreQueued,
  };
}

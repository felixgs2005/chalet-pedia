const { initializeApp } = require("firebase-admin/app");
const { FieldValue } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { sendContactEmail, sendAdvertiserEmail } = require("./SendEmail");

initializeApp();

const region = process.env.FUNCTIONS_REGION || "northamerica-northeast1";

/**
 * Déclenchée à la création d'un document dans contactMessages (formulaire Contact.jsx).
 * Envoie le courriel via Nodemailer puis met à jour le statut du document.
 */
exports.onContactMessageCreated = onDocumentCreated(
  {
    document: "contactMessages/{messageId}",
    region,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const docRef = snap.ref;

    try {
      const result = await sendContactEmail(data);
      await docRef.update({
        statut: "envoye",
        emailEnvoyeLe: FieldValue.serverTimestamp(),
        destinataireInterne: result.to,
        messageIdCourriel: result.messageId || null,
      });
    } catch (err) {
      console.error("sendContactEmail:", err);
      await docRef.update({
        statut: "erreur",
        erreurEnvoi: err.message || "Erreur envoi courriel",
        emailEnvoyeLe: FieldValue.serverTimestamp(),
      });
    }
  }
);

/**
 * Déclenchée à la création d'un document dans messages (« Contacter l'annonceur »).
 * Envoie un courriel à l'annonceur via Nodemailer si son adresse est connue.
 */
exports.onAnnonceurMessageCreated = onDocumentCreated(
  {
    document: "messages/{messageId}",
    region,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const docRef = snap.ref;

    try {
      const result = await sendAdvertiserEmail(data);
      if (result.skipped) {
        await docRef.update({
          statutCourriel: "sans_email",
          courrielEnvoyeLe: FieldValue.serverTimestamp(),
        });
        return;
      }

      await docRef.update({
        statutCourriel: "envoye",
        courrielEnvoyeLe: FieldValue.serverTimestamp(),
        destinataireCourriel: result.to,
        messageIdCourriel: result.messageId || null,
      });
    } catch (err) {
      console.error("sendAdvertiserEmail:", err);
      await docRef.update({
        statutCourriel: "erreur",
        erreurCourriel: err.message || "Erreur envoi courriel",
        courrielEnvoyeLe: FieldValue.serverTimestamp(),
      });
    }
  }
);

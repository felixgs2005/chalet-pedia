const { initializeApp } = require("firebase-admin/app");
const { FieldValue } = require("firebase-admin/firestore");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const {
  sendContactEmail,
  sendListingContactEmail,
  sendNewListingAdminEmail,
} = require("./SendEmail");
const { createPasswordResetHandlers } = require("./passwordReset");

initializeApp();

const region = process.env.FUNCTIONS_REGION || "northamerica-northeast1";

const { requestPasswordResetCode, resetPasswordWithCode } =
  createPasswordResetHandlers(region);

exports.requestPasswordResetCode = requestPasswordResetCode;
exports.resetPasswordWithCode = resetPasswordWithCode;

/**
 * Déclenchée à la création d'un document dans contactMessages (formulaire Contact.jsx).
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
 * Déclenchée à la création d'un document dans listingContactMessages (modale annonceur).
 */
exports.onListingContactCreated = onDocumentCreated(
  {
    document: "listingContactMessages/{messageId}",
    region,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    const docRef = snap.ref;

    try {
      const result = await sendListingContactEmail(data);
      await docRef.update({
        statut: "envoye",
        emailEnvoyeLe: FieldValue.serverTimestamp(),
        destinataireCourriel: result.to,
        messageIdCourriel: result.messageId || null,
      });
    } catch (err) {
      console.error("sendListingContactEmail:", err);
      await docRef.update({
        statut: "erreur",
        erreurEnvoi: err.message || "Erreur envoi courriel",
        emailEnvoyeLe: FieldValue.serverTimestamp(),
      });
    }
  }
);

async function notifyAdminOnNewListing(snap, meta) {
  const data = snap.data();
  const docRef = snap.ref;

  try {
    const result = await sendNewListingAdminEmail(data, meta);
    if (result.skipped) return;

    await docRef.update({
      notificationAdminEnvoyeeLe: FieldValue.serverTimestamp(),
      notificationAdminDestinataire: result.to,
      notificationAdminMessageId: result.messageId || null,
    });
  } catch (err) {
    console.error("sendNewListingAdminEmail:", err);
    await docRef.update({
      notificationAdminErreur: err.message || "Erreur notification admin",
      notificationAdminEnvoyeeLe: FieldValue.serverTimestamp(),
    });
  }
}

/** Nouvelle annonce chalet à louer — notification admin. */
exports.onChaletListingCreated = onDocumentCreated(
  { document: "chalets/{listingId}", region },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    await notifyAdminOnNewListing(snap, {
      type: "chalet",
      listingId: event.params.listingId,
    });
  }
);

/** Nouvelle annonce chalet à vendre — notification admin. */
exports.onVenteListingCreated = onDocumentCreated(
  { document: "ventes/{listingId}", region },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    await notifyAdminOnNewListing(snap, {
      type: "vente",
      listingId: event.params.listingId,
    });
  }
);

/** Nouvelle annonce service — notification admin. */
exports.onServiceListingCreated = onDocumentCreated(
  {
    document: "categorieServices/{categoryId}/annoncesService/{listingId}",
    region,
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    await notifyAdminOnNewListing(snap, {
      type: "service",
      listingId: event.params.listingId,
      categorySlug: event.params.categoryId,
    });
  }
);

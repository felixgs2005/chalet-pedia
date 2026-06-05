import { normalizeEmail } from "../utils/normalizeEmail";

export function resolveAdvertiserEmail(destinataire, cible) {
  return (
    normalizeEmail(destinataire?.email) ||
    normalizeEmail(cible?.destinataireEmail) ||
    null
  );
}

/**
 * Indique si un courriel sera tenté via Cloud Function (Nodemailer) après création du message.
 */
export function describeAdvertiserEmailNotification(destinataire, cible) {
  const toEmail = resolveAdvertiserEmail(destinataire, cible);
  if (!toEmail) {
    return { willNotify: false, reason: "no_advertiser_email", toEmail: null };
  }
  return {
    willNotify: true,
    toEmail,
    reason: "cloud_function",
  };
}

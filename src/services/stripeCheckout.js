import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";

const functions = getFunctions(app, "northamerica-northeast1");

function mapCallableError(err) {
  const code = err?.code || "";
  const message = err?.message || "Une erreur est survenue.";

  if (code.includes("unauthenticated")) return "Connectez-vous pour continuer.";
  if (code.includes("already-exists")) return message;
  if (code.includes("failed-precondition")) return message;
  if (code.includes("invalid-argument")) return message;
  if (code.includes("internal")) return "Stripe est temporairement indisponible. Réessayez.";

  return message || "Une erreur est survenue. Veuillez réessayer.";
}

/** Redirige vers Stripe Checkout pour un plan (chalets | services). */
export async function startSubscriptionCheckout(plan) {
  const fn = httpsCallable(functions, "createCheckoutSession");
  try {
    const { data } = await fn({ plan });
    if (!data?.url) throw new Error("URL de paiement indisponible.");
    window.location.assign(data.url);
  } catch (err) {
    throw new Error(mapCallableError(err));
  }
}

/** Ouvre le portail client Stripe (gestion / annulation). */
export async function openBillingPortal() {
  const fn = httpsCallable(functions, "createBillingPortalSession");
  try {
    const { data } = await fn({});
    if (!data?.url) throw new Error("Portail de facturation indisponible.");
    window.location.assign(data.url);
  } catch (err) {
    throw new Error(mapCallableError(err));
  }
}

export const ACTIVE_SUBSCRIPTION_STATUSES = ["active", "trialing"];

export function getPlanSubscription(subscriptions, planId) {
  if (!subscriptions || !planId) return null;
  return subscriptions[planId] || null;
}

export function isPlanActive(subscriptions, planId) {
  const sub = getPlanSubscription(subscriptions, planId);
  return sub != null && ACTIVE_SUBSCRIPTION_STATUSES.includes(sub.status);
}

export function hasChaletsSubscription(subscriptions) {
  return isPlanActive(subscriptions, "chalets");
}

export function hasServicesSubscription(subscriptions) {
  return isPlanActive(subscriptions, "services");
}

export function formatSubscriptionEndDate(timestamp) {
  if (!timestamp) return "";
  const date =
    typeof timestamp.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function planStatusLabel(subscriptions, planId) {
  const sub = getPlanSubscription(subscriptions, planId);
  if (!sub) return "Non abonné";
  if (isPlanActive(subscriptions, planId)) {
    if (sub.cancelAtPeriodEnd) return "Actif (fin prévue)";
    return "Actif";
  }
  if (sub.status === "past_due") return "Paiement en retard";
  if (sub.status === "canceled") return "Expiré";
  return "Inactif";
}

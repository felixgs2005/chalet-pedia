/** Affichage UI — les price IDs Stripe sont côté Cloud Functions (STRIPE_PRICE_*). */
const GST_RATE = 0.05;
const QST_RATE = 0.09975;

/** Total estimé au Québec : TVQ calculée sur le montant + TPS. */
export function estimateQuebecTaxTotal(subtotal) {
  const gst = subtotal * GST_RATE;
  const qst = (subtotal + gst) * QST_RATE;
  return subtotal + gst + qst;
}

function buildPlanPricing(subtotal) {
  return {
    subtotalAmount: subtotal,
    priceAmount: String(subtotal),
    priceLabel: `${subtotal}+taxes`,
    periodLabel: "par année",
  };
}

export const SUBSCRIPTION_PLANS = {
  chalets: {
    id: "chalets",
    name: "Annonces chalets",
    ...buildPlanPricing(90),
    billingNote:
      "Renouvellement automatique chaque année par prélèvement sur votre carte. TPS et TVQ ajoutées au paiement.",
    headline: "Louer ou vendre des chalets",
    description:
      "Publiez des annonces de chalets à louer ou à vendre, sans limite de nombre.",
    features: [
      "Chalets à louer et chalets à vendre",
      "Annonces illimitées",
      "Renouvellement annuel automatique",
      "Validation par l'équipe ChaletPedia",
    ],
  },
  services: {
    id: "services",
    name: "Annonces services",
    ...buildPlanPricing(45),
    billingNote:
      "Renouvellement automatique chaque année par prélèvement sur votre carte. TPS et TVQ ajoutées au paiement.",
    headline: "Répertoire des services",
    description:
      "Publiez vos services (construction, décoration, entretien, multimédia).",
    features: [
      "Toutes les catégories de services",
      "Annonces illimitées",
      "Renouvellement annuel automatique",
      "Validation par l'équipe ChaletPedia",
    ],
  },
};

export const SUBSCRIPTION_PLAN_LIST = [
  SUBSCRIPTION_PLANS.chalets,
  SUBSCRIPTION_PLANS.services,
];

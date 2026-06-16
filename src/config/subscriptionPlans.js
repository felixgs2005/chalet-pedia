/** Affichage UI — les price IDs Stripe sont côté Cloud Functions (STRIPE_PRICE_*). */
export const SUBSCRIPTION_PLANS = {
  chalets: {
    id: "chalets",
    name: "Annonces chalets",
    priceLabel: "90 $",
    periodLabel: "par année",
    billingNote: "Renouvellement automatique chaque année par prélèvement sur votre carte.",
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
    priceLabel: "45 $",
    periodLabel: "par année",
    billingNote: "Renouvellement automatique chaque année par prélèvement sur votre carte.",
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

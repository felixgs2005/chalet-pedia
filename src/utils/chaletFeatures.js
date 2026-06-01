// Correspondance caractéristiques ↔ mots-clés dans chalet.caracteristiques

export const FEATURE_KEYWORDS = {
  animaux: ["animaux", "pet"],
  bordEau: ["eau", "mer", "lac", "fjord", "plage", "bord"],
  boise: ["boisé", "boise", "nature", "forêt", "foret"],
  poker: ["poker"],
  billard: ["billard"],
  spa: ["spa", "sauna"],
  foyer: ["foyer"],
  handicape: ["handicap", "accessible"],
  couples: ["romantique", "couple"],
  plage: ["plage"],
  famille: ["famille", "groupe"],
};

export function chaletHasFeature(chalet, featureKey) {
  const keywords = FEATURE_KEYWORDS[featureKey];
  if (!keywords) return false;
  const chaletFeatures = chalet.caracteristiques || [];
  return chaletFeatures.some((f) =>
    keywords.some((kw) => f.toLowerCase().includes(kw))
  );
}

export const EMPTY_FEATURES_STATE = {
  animaux: false,
  bordEau: false,
  boise: false,
  poker: false,
  billard: false,
  spa: false,
  foyer: false,
  handicape: false,
  couples: false,
  plage: false,
  famille: false,
};

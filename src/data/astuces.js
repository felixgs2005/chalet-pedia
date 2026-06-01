// src/data/astuces.js
// Données de la page Académie › Astuces (/academie/astuces/)
import { getArticleBySlug } from "./articles";

export const astucesCards = [
  {
    slug: "15-pieges-eviter-location-chalet",
    tags: [
      { label: "Astuces", emoji: "💡" },
      { label: "Chalets" },
      { label: "Sécurité", emoji: "🔒" },
    ],
  },
  {
    slug: "noel-au-chalet-guide-decoration",
    tags: [
      { label: "Astuces", emoji: "💡" },
      { label: "Découvertes" },
    ],
  },
  {
    slug: "5-astuces-augmenter-reservations-chalet-locatif",
    tags: [
      { label: "Astuces", emoji: "💡" },
      { label: "Investissement", emoji: "💰" },
    ],
  },
];

export const citqSteps = [
  {
    num: 1,
    icon: "📋",
    title: "Obtenir un numéro d'enregistrement CITQ",
    desc: "Inscription obligatoire auprès de la Corporation de l'industrie touristique du Québec.",
  },
  {
    num: 2,
    icon: "🛡️",
    title: "Souscrire à une assurance responsabilité",
    desc: "Protection minimale en cas d'incident pour les invités ou les biens.",
  },
  {
    num: 3,
    icon: "🏠",
    title: "Vérifier les règlements municipaux",
    desc: "Chaque municipalité a ses règles : zonage, bruit, stationnement, etc.",
  },
  {
    num: 4,
    icon: "🧾",
    title: "Déclarer ses revenus locatifs",
    desc: "Inclure les revenus dans votre déclaration annuelle (Revenu Québec et Impôt Canada).",
  },
  {
    num: 5,
    icon: "💻",
    title: "Afficher votre numéro CITQ en ligne",
    desc: "Obligatoire sur toute annonce : site web, réseaux sociaux, plateformes.",
  },
];

export const getAstucesArticles = () =>
  astucesCards
    .map((card) => {
      const article = getArticleBySlug(card.slug);
      if (!article) return null;
      return { ...article, astuceTags: card.tags };
    })
    .filter(Boolean);

export const isAstuceSlug = (slug) => astucesCards.some((c) => c.slug === slug);

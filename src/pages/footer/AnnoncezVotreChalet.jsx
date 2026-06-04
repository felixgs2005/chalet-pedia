// src/pages/footer/AnnoncezVotreChalet.jsx
// Page : /annoncez-votre-chalet/
// Contenu aligné sur chaletpedia.com/annoncez-votre-chalet/

import { useState } from "react";
import { Link } from "react-router-dom";

const POURQUOI = [
  {
    icon: "💰",
    titre: "Zéro commission",
    desc: "Vous encaissez 100 % des revenus de vos locations.",
  },
  {
    icon: "👁️",
    titre: "Visibilité maximale",
    desc: "Répertoire #1 au Québec avec 2,3 millions de visiteurs annuels.",
  },
  {
    icon: "🤝",
    titre: "Aucun intermédiaire",
    desc: "Accès direct aux locataires via nos outils de communication.",
  },
  {
    icon: "⚙️",
    titre: "Gestion simple",
    desc: "Modification facile et illimitée de votre annonce, sans frais supplémentaires.",
  },
];

const AVANTAGES_LISTE = [
  "Site web performant : design moderne et navigation intuitive",
  "Référencement optimisé : plus de 500 000 visiteurs annuels et forte présence sur Google",
  "Publicité ciblée : diffusion sur babillards, réseaux sociaux et plateformes stratégiques",
];

const FORFAITS_INCLUS = [
  "Annonce régulièrement publiée sur nos réseaux sociaux",
  "Lien « Réservez maintenant » vers votre système de réservation en ligne",
  "Jusqu'à 3 annonces dans la section rabais dernière minute",
  "Lien vers votre site Web et réseaux sociaux",
  "Calendrier des disponibilités (synchronisation Airbnb, iCloud, Google Calendar, etc.)",
];

const FORFAITS = [
  {
    id: "bronze",
    nom: "Bronze",
    prix: "87 $",
    prixBarre: null,
    features: [
      "Aucune priorité de recherche",
      "10 photos haute résolution avec outils de retouche",
      "Annonce mise en avant sur la page d'accueil et recherche",
    ],
    highlight: false,
  },
  {
    id: "argent",
    nom: "Argent",
    prix: "125 $",
    prixBarre: "160 $",
    features: [
      "Priorité de recherche avant Bronze",
      "30 photos haute résolution avec outils de retouche",
      "Annonce mise en avant sur la page d'accueil et recherche",
    ],
    highlight: true,
  },
  {
    id: "or",
    nom: "Or",
    prix: "280 $",
    prixBarre: null,
    features: [
      "Priorité de recherche avant Argent",
      "60 photos haute résolution avec outils de retouche",
      "Annonce mise en avant sur la page d'accueil et recherche",
    ],
    highlight: false,
  },
];

const TYPES_ANNONCES = [
  "Chalets à louer — courts, moyens ou longs séjours, avec ou sans spa",
  "Chalets à vendre — du rustique au luxe",
  "Terrains à vendre — pour construire ou investir",
  "Constructeurs de chalets — faites connaître vos services et projets",
  "Décoration et accessoires — pour aménager ou embellir les chalets",
];

const FAQ_SECTIONS = [
  {
    id: "inscription",
    titre: "Annonce, compte et inscription",
    questions: [
      {
        q: "Quels établissements peuvent ajouter leur annonce sur la plateforme ?",
        r: "Nous recherchons des lieux uniques, d'un niveau supérieur, pour se détendre en harmonie avec la nature partout au Québec. Si vous êtes propriétaire d'un tel lieu, contactez-nous !",
      },
      {
        q: "Comment ajouter un objet à votre base de données ?",
        r: "Soumettez votre propriété via le formulaire de demande sur notre site. Nous vérifierons votre demande et vous répondrons dans les 24 heures.",
      },
      {
        q: "Combien coûte-t-il de s'inscrire sur ChaletPedia ?",
        r: "Les frais d'abonnement démarrent à 87 $ / an selon le forfait choisi (Bronze, Argent ou Or).",
      },
      {
        q: "Payez-vous une commission sur les réservations ?",
        r: "Non, nous ne déduisons aucune commission sur les réservations effectuées via la plateforme.",
      },
    ],
  },
  {
    id: "marketing",
    titre: "Marketing, ressources et outils",
    questions: [
      {
        q: "Qu'est-ce que je reçois dans le cadre des frais d'abonnement ?",
        r: "Réductions chez nos partenaires, visibilité sur le site, participation à nos activités marketing, mentions dans notre infolettre et avantages auprès de fournisseurs (sites Web, saunas, systèmes de réservation, etc.).",
      },
      {
        q: "Combien de personnes visitent vos réseaux sociaux et votre site web ?",
        r: "Communauté de 67 500 abonnés fidèles depuis 2017 et une moyenne de plus de 3 millions de clics par mois.",
      },
      {
        q: "Est-il possible d'acheter des activités supplémentaires ?",
        r: "Oui : arrivée dans l'établissement avec rapport détaillé, publication sur nos réseaux sociaux, position plus élevée sur la plateforme. Soumettez votre demande pour recevoir l'offre complète.",
      },
    ],
  },
  {
    id: "calendrier",
    titre: "Calendrier, réservations et technique",
    questions: [
      {
        q: "À quoi ressemble la réservation via la plateforme ?",
        r: "Le client choisit une date sur la fiche, envoie une demande à l'hôte qui reçoit une notification par courriel. Les détails se finalisent par messagerie ou téléphone. La plateforme n'intervient pas dans les paiements.",
      },
      {
        q: "Est-il possible de synchroniser les calendriers ?",
        r: "Oui, la synchronisation avec Airbnb, iCloud, Google Calendar et d'autres outils est possible.",
      },
      {
        q: "Quelles sont les options de modification des prix ?",
        r: "Prix « à partir de X $ / nuit » affiché sur l'annonce, avec possibilité de tarifs différents selon le jour de la semaine, les fériés et les longs week-ends.",
      },
      {
        q: "Puis-je fixer une durée minimale de séjour ?",
        r: "Oui, depuis votre tableau de bord vous pouvez définir des durées minimales par période de l'année.",
      },
      {
        q: "Puis-je mettre mes coordonnées sur ma fiche ?",
        r: "Oui. Téléphone, courriel ou site Web peuvent être ajoutés à votre annonce.",
      },
    ],
  },
];

const FAQ_PUBLIER = [
  {
    q: "Qui peut publier une annonce ?",
    r: "Tout propriétaire, gestionnaire, constructeur ou vendeur lié au secteur des chalets au Québec.",
  },
  {
    q: "Quels types d'annonces puis-je publier ?",
    r: "Chalets à louer, chalets à vendre, terrains, services de construction, décoration et accessoires.",
  },
  {
    q: "Puis-je modifier ou supprimer mon annonce ?",
    r: "Oui, à tout moment via votre espace propriétaire.",
  },
  {
    q: "Quel support propose ChaletPedia ?",
    r: "Notre équipe vous accompagne pour créer, gérer et optimiser vos annonces.",
  },
];

function FaqAccordion({ sections }) {
  const [openSections, setOpenSections] = useState({ inscription: true });
  const [openQuestions, setOpenQuestions] = useState({});

  const toggleSection = (id) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleQuestion = (sectionId, idx) => {
    const key = `${sectionId}-${idx}`;
    setOpenQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="faq-sections">
      {sections.map((section) => (
        <div key={section.id} className="faq-section">
          <button
            type="button"
            className="faq-section-header"
            onClick={() => toggleSection(section.id)}
          >
            <h2 className="faq-section-title">{section.titre}</h2>
            <span className="faq-section-toggle">{openSections[section.id] ? "−" : "+"}</span>
          </button>
          {openSections[section.id] && (
            <div className="faq-section-content">
              {section.questions.map((item, idx) => {
                const key = `${section.id}-${idx}`;
                const isOpen = openQuestions[key];
                return (
                  <div key={key} className="faq-item">
                    <button
                      type="button"
                      className="faq-question"
                      onClick={() => toggleQuestion(section.id, idx)}
                    >
                      <span className="faq-q-mark" aria-hidden="true">
                        ?
                      </span>
                      <span className="faq-q-text">{item.q}</span>
                      <span className="faq-chevron">{isOpen ? "−" : "+"}</span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.r}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AnnoncezVotreChalet() {
  return (
    <div className="promo-page annoncez-page">
      <section className="promo-hero">
        <div className="promo-hero-inner">
          <div className="promo-hero-kicker">PROPRIÉTAIRES · CHALETPEDIA</div>
          <h1 className="promo-hero-title">Annoncez votre chalet</h1>
          <p className="promo-hero-sub">
            Vous êtes propriétaire d&apos;un chalet et rêvez de trouver des locataires
            passionnés ou des acheteurs potentiels ? Notre annuaire est l&apos;endroit
            idéal pour <strong>maximiser votre visibilité</strong> et attirer les bons
            visiteurs.
          </p>
          <p className="inscrire-hero-login">
            Déjà un compte ? <Link to="/auth">Connectez-vous</Link>
          </p>
          <Link to="/submit-listing/details/" className="promo-hero-cta">
            Publier mon annonce →
          </Link>
        </div>
      </section>

      <section className="annoncez-pourquoi">
        <div className="annoncez-pourquoi-inner">
          <div className="promo-strategy-kicker">Pourquoi nous choisir ?</div>
          <h2 className="promo-strategy-title">Chez ChaletPedia</h2>
          <p className="promo-strategy-desc">
            On simplifie la recherche de chalets au Québec, que ce soit pour vos vacances
            ou pour investir. Avec ChaletPedia, la visibilité de votre chalet est assurée
            grâce à notre référencement et à des milliers de visiteurs chaque mois.
          </p>
          <div className="annoncez-pourquoi-grid">
            {POURQUOI.map((item) => (
              <div key={item.titre} className="promo-atout-card">
                <span className="promo-atout-icon">{item.icon}</span>
                <div>
                  <h3 className="promo-atout-titre">{item.titre}</h3>
                  <p className="promo-atout-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="annoncez-avantages">
        <div className="annoncez-avantages-inner">
          <h2 className="promo-services-title">Nos avantages</h2>
          <ul className="promo-strategy-list annoncez-liste">
            {AVANTAGES_LISTE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="annoncez-forfaits">
        <div className="annoncez-forfaits-inner">
          <h2 className="promo-services-title">Forfaits</h2>
          <p className="promo-services-sub">
            Un seul tarif annuel par inscription de chalet, pour tous les annonceurs.
          </p>
          <ul className="annoncez-forfaits-inclus">
            {FORFAITS_INCLUS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="annoncez-forfaits-grid">
            {FORFAITS.map((forfait) => (
              <div
                key={forfait.id}
                className={`annoncez-forfait-card${forfait.highlight ? " annoncez-forfait-card--featured" : ""}`}
              >
                {forfait.highlight && (
                  <span className="annoncez-forfait-badge">Populaire</span>
                )}
                <h3 className="annoncez-forfait-nom">{forfait.nom}</h3>
                <div className="annoncez-forfait-prix">
                  {forfait.prixBarre && (
                    <span className="annoncez-forfait-prix-barre">{forfait.prixBarre}</span>
                  )}
                  <span className="annoncez-forfait-prix-actuel">{forfait.prix}</span>
                  <span className="annoncez-forfait-prix-periode">/ an</span>
                </div>
                <ul className="annoncez-forfait-features">
                  {forfait.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/submit-listing/details/" className="annoncez-forfait-cta">
                  Choisir
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="annoncez-publier">
        <div className="annoncez-publier-inner">
          <h2 className="promo-strategy-title">Publiez votre annonce sur ChaletPedia</h2>
          <p className="promo-strategy-desc">
            Que vous soyez propriétaire, gestionnaire, constructeur ou vendeur, ChaletPedia
            vous offre une plateforme simple pour mettre en valeur votre offre au Québec.
          </p>
          <h3 className="annoncez-sous-titre">Types d&apos;annonces acceptées</h3>
          <ul className="promo-strategy-list">
            {TYPES_ANNONCES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="faq-content annoncez-faq">
        <div className="faq-content-inner">
          <h2 className="promo-services-title">FAQ</h2>
          <p className="promo-services-sub">
            Les questions les plus fréquentes sur l&apos;affichage d&apos;une annonce de
            chalet à louer ou à vendre.
          </p>
          <FaqAccordion sections={FAQ_SECTIONS} />

          <h3 className="annoncez-faq-sous-titre">Publier une annonce</h3>
          <div className="annoncez-faq-simple">
            {FAQ_PUBLIER.map((item) => (
              <div key={item.q} className="annoncez-faq-simple-item">
                <strong>{item.q}</strong>
                <p>{item.r}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="promo-final-cta">
        <div className="promo-final-inner">
          <div className="promo-final-kicker">PASSEZ À L&apos;ACTION</div>
          <h2 className="promo-final-title">Prêt à booster vos réservations ?</h2>
          <p className="promo-final-sub">
            Inscrivez-vous dès maintenant et rejoignez la communauté des propriétaires qui
            réussissent grâce à ChaletPedia. Fini les annonces perdues — ici, votre chalet
            sera mis en avant.
          </p>
          <Link to="/submit-listing/details/" className="promo-final-btn">
            Publier mon annonce →
          </Link>
        </div>
      </section>
    </div>
  );
}

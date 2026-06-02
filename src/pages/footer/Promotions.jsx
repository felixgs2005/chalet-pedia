// src/pages/Promotions.jsx
// ============================================================
// PAGE PROMOTIONS (/promotions/)
// Options pour booster la visibilité des annonces.
// ============================================================

export default function Promotions() {
  const options = [
    {
      id: "boost",
      titre: "Boost Simple",
      prix: "29 $ / mois",
      periode: "Mise en avant 30 jours",
      couleur: "#1f4d3a",
      points: [
        "Badge 'Promo' sur votre annonce",
        "Position améliorée dans les résultats",
        "+200 % de vues en moyenne",
        "Renouvellement mensuel simple",
        "Sans engagement",
      ],
      recommandation: "Parfait pour tester l'impact",
    },
    {
      id: "pro",
      titre: "Boost Pro",
      prix: "79 $ / mois",
      periode: "Mise en avant premium",
      couleur: "#2a6b50",
      points: [
        "Tous les avantages du Boost Simple",
        "Placement en tête de page dans votre région",
        "Badge 'Coup de cœur' exclusif",
        "Analyses détaillées des performances",
        "Support prioritaire",
        "+350 % de vues en moyenne",
      ],
      recommandation: "Pour maximiser vos réservations",
      populaire: true,
    },
    {
      id: "saison",
      titre: "Pack Saisonnier",
      prix: "199 $ / 4 mois",
      periode: "Couverture complète saison",
      couleur: "#0f0f0f",
      points: [
        "Tous les avantages du Boost Pro",
        "Optimisation saisonnière automatique",
        "Promotions ciblées (Noël, vacances, etc.)",
        "Rapport mensuel personnalisé",
        "Économie de 20 % vs mensuel",
        "Calendrier de promotions pré-planifié",
      ],
      recommandation: "Pour les propriétaires actifs",
    },
    {
      id: "decouverte",
      titre: "Découverte",
      prix: "Gratuit",
      periode: "7 jours",
      couleur: "#4a3a1f",
      points: [
        "Test du Boost Simple gratuitement",
        "Aucune carte bancaire requise",
        "Accès aux statistiques de visibilité",
        "Guide d'optimisation inclus",
        "Sans engagement, sans automatisation",
      ],
      recommandation: "Essayer avant d'acheter",
    },
  ];

  const stats = [
    { num: "+200%", label: "visites en moyenne avec Boost" },
    { num: "3.5x", label: "plus de réservations" },
    { num: "87%", label: "de clients renouvellent" },
    { num: "24h", label: "activation sous 24h" },
  ];

  const etapes = [
    {
      num: 1,
      titre: "Choisissez votre option",
      desc: "Sélectionnez le boost qui correspond à vos besoins et budget.",
    },
    {
      num: 2,
      titre: "Activez en 2 clics",
      desc: "Rien à installer. Activation immédiate depuis votre tableau de bord.",
    },
    {
      num: 3,
      titre: "Suivez vos performances",
      desc: "Visualisez l'impact sur vos vues, contacts et réservations.",
    },
    {
      num: 4,
      titre: "Optimisez au besoin",
      desc: "Notre équipe vous conseille pour maximiser vos résultats.",
    },
  ];

  return (
    <div className="promotions-page">
      {/* ── HERO ── */}
      <section className="promotions-hero">
        <div className="promotions-hero-kicker">PROPRIÉTAIRES · CHALETPEDIA</div>
        <h1 className="promotions-hero-title">
          Boostez votre <span className="promotions-hero-accent">visibilité</span>
        </h1>
        <p className="promotions-hero-sub">
          Faites sortir votre annonce du lot et multipliez vos réservations avec
          nos options de promotion ciblées.
        </p>
      </section>

      {/* ── STATS ── */}
      <section className="promotions-stats">
        <div className="promotions-stats-inner">
          {stats.map((stat) => (
            <div key={stat.label} className="promotions-stat">
              <span className="promotions-stat-num">{stat.num}</span>
              <span className="promotions-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── OPTIONS ── */}
      <section className="promotions-options">
        <div className="promotions-options-inner">
          <h2 className="promotions-section-title">Choisissez votre boost</h2>
          <p className="promotions-section-sub">
            Des options flexibles pour tous les budgets et tous les niveaux
            d'activité.
          </p>

          <div className="promotions-grid">
            {options.map((option) => (
              <div
                key={option.id}
                className={`promotion-card${option.populaire ? " populaire" : ""}`}
                style={{ borderColor: option.couleur }}
              >
                {option.populaire && (
                  <div className="promotion-badge">Le plus populaire</div>
                )}

                <div className="promotion-header">
                  <h3 className="promotion-titre">{option.titre}</h3>
                  <div className="promotion-prix">{option.prix}</div>
                  <div className="promotion-periode">{option.periode}</div>
                </div>

                <ul className="promotion-points">
                  {option.points.map((point, idx) => (
                    <li key={idx} className="promotion-point">
                      <span className="promotion-point-icon">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="promotion-recommandation">
                  <strong>Recommandé :</strong> {option.recommandation}
                </div>

                <button
                  className="promotion-cta"
                  type="button"
                  style={{ background: option.couleur }}
                >
                  {option.id === "decouverte"
                    ? "Essayer gratuitement →"
                    : "Choisir cette option →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉTAPES ── */}
      <section className="promotions-etapes">
        <div className="promotions-etapes-inner">
          <h2 className="promotions-section-title">Comment ça marche ?</h2>
          <p className="promotions-section-sub">
            Un processus simple et transparent pour maximiser vos résultats.
          </p>

          <div className="etapes-grid">
            {etapes.map((etape) => (
              <div key={etape.num} className="etape-card">
                <div className="etape-num">{etape.num}</div>
                <h3 className="etape-titre">{etape.titre}</h3>
                <p className="etape-desc">{etape.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="promotions-faq">
        <div className="promotions-faq-inner">
          <h2 className="promotions-section-title">Questions fréquentes</h2>

          <div className="promotions-faq-items">
            <div className="promotions-faq-item">
              <h3>Puis-je annuler à tout moment ?</h3>
              <p>
                Oui, toutes nos options sont sans engagement. Vous pouvez
                annuler à tout moment depuis votre tableau de bord. Aucun frais
                d'annulation.
              </p>
            </div>
            <div className="promotions-faq-item">
              <h3>Combien de temps pour voir les résultats ?</h3>
              <p>
                Les effets sont généralement visibles dans les 48h suivant
                l'activation. Nous fournissons des statistiques en temps réel
                pour suivre l'impact.
              </p>
            </div>
            <div className="promotions-faq-item">
              <h3>Le boost fonctionne-t-il sur tous les chalets ?</h3>
              <p>
                Oui, tant que votre annonce est active et conforme. L'impact
                peut varier selon la région, la saison et la qualité de votre
                annonce.
              </p>
            </div>
            <div className="promotions-faq-item">
              <h3>Y a-t-il un remboursement si je ne suis pas satisfait ?</h3>
              <p>
                Oui, garantie satisfait ou remboursé pendant 14 jours. Si vous
                n'êtes pas satisfait des résultats, nous vous remboursons
                intégralement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="promotions-final-cta">
        <div className="promotions-final-cta-inner">
          <h2 className="promotions-final-title">Prêt à booster vos réservations ?</h2>
          <p className="promotions-final-sub">
            Commencez par l'option Découverte gratuite et voyez la différence
            par vous-même.
          </p>
          <button className="promotions-final-btn" type="button">
            Essayer gratuitement →
          </button>
        </div>
      </section>
    </div>
  );
}

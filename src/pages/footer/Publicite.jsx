// src/pages/Publicite.jsx
// ============================================================
// PAGE PUBLICITÉ (/publicite/)
// Espaces publicitaires pour entreprises et partenaires.
// ============================================================

export default function Publicite() {
  const formats = [
    {
      id: "banniere",
      titre: "Bannières publicitaires",
      description:
        "Placements visibles sur toutes les pages stratégiques : accueil, résultats de recherche, fiches chalets.",
      tailles: ["970×250", "728×90", "300×600"],
      cible: "Entreprises touristiques, assurances, équipement",
      tarif: "À partir de 500 $ / mois",
      couleur: "#1f4d3a",
    },
    {
      id: "sponsor",
      titre: "Sponsoring thématique",
      description:
        "Votre marque associée à une catégorie spécifique : chalets avec spa, A-Frame, bord de mer, etc.",
      tailles: ["Logo + texte dédié"],
      cible: "Marques premium, constructeurs, décorateurs",
      tarif: "À partir de 1 200 $ / mois",
      couleur: "#2a6b50",
    },
    {
      id: "newsletter",
      titre: "Newsletter & emailing",
      description:
        "Votre message dans nos newsletters mensuelles (20 000+ abonnés) et campagnes ciblées.",
      tailles: ["Bannière 600×200", "Encart texte"],
      cible: "Toutes entreprises B2C et B2B",
      tarif: "À partir de 300 $ / envoi",
      couleur: "#0f0f0f",
    },
    {
      id: "contenu",
      titre: "Contenu sponsorisé",
      description:
        "Articles, guides ou vidéos créés en collaboration et diffusés sur notre blogue et réseaux.",
      tailles: ["Article 800+ mots", "Vidéo 2-3 min"],
      cible: "Entreprises avec expertise à valoriser",
      tarif: "Sur devis personnalisé",
      couleur: "#4a3a1f",
    },
  ];

  const avantages = [
    {
      icon: "🎯",
      titre: "Audience ciblée",
      desc: "Propriétaires et locataires de chalets au Québec, passionnés de nature et de vacances.",
    },
    {
      icon: "📊",
      titre: "Statistiques détaillées",
      desc: "Accès à nos dashboards avec impressions, clics, taux d'engagement en temps réel.",
    },
    {
      icon: "🤝",
      titre: "Approche collaborative",
      desc: "Notre équipe vous accompagne pour optimiser vos campagnes et maximiser votre ROI.",
    },
    {
      icon: "📈",
      titre: "Performances garanties",
      desc: "Objectifs clairs définis ensemble et suivi régulier pour atteindre vos KPI.",
    },
  ];

  const stats = [
    { num: "50 000+", label: "visites mensuelles" },
    { num: "70%", label: "taux de retour" },
    { num: "3 min", label: "temps moyen par session" },
    { num: "25-55 ans", label: "cible principale" },
  ];

  const cibles = [
    "Propriétaires de chalets (40%)",
    "Locataires en recherche (35%)",
    "Professionnels du secteur (15%)",
    "Passionnés de décoration (10%)",
  ];

  return (
    <div className="publicite-page">
      {/* ── HERO ── */}
      <section className="publicite-hero">
        <div className="publicite-hero-kicker">PARTENARIATS · CHALETPEDIA</div>
        <h1 className="publicite-hero-title">
          Votre publicité sur <span className="publicite-hero-accent">ChaletPedia</span>
        </h1>
        <p className="publicite-hero-sub">
          Atteignez une audience engagée de propriétaires et locataires de
          chalets au Québec avec nos solutions publicitaires sur mesure.
        </p>
      </section>

      {/* ── STATS AUDIENCE ── */}
      <section className="publicite-stats">
        <div className="publicite-stats-inner">
          <h2 className="publicite-stats-title">Notre audience en chiffres</h2>
          <p className="publicite-stats-sub">
            Des chiffres transparents pour vous aider à prendre la bonne
            décision.
          </p>

          <div className="publicite-stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="publicite-stat">
                <span className="publicite-stat-num">{stat.num}</span>
                <span className="publicite-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="publicite-cibles">
            <h3 className="publicite-cibles-title">Notre cible démographique</h3>
            <ul className="publicite-cibles-list">
              {cibles.map((cible, idx) => (
                <li key={idx} className="publicite-cible-item">
                  <span className="publicite-cible-icon">✓</span>
                  {cible}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FORMATS ── */}
      <section className="publicite-formats">
        <div className="publicite-formats-inner">
          <h2 className="publicite-section-title">Nos formats publicitaires</h2>
          <p className="publicite-section-sub">
            Des solutions adaptées à vos objectifs et à votre budget.
          </p>

          <div className="publicite-formats-grid">
            {formats.map((format) => (
              <div
                key={format.id}
                className="publicite-format-card"
                style={{ borderTopColor: format.couleur }}
              >
                <h3 className="publicite-format-titre">{format.titre}</h3>
                <p className="publicite-format-desc">{format.description}</p>

                <div className="publicite-format-details">
                  <div className="publicite-detail">
                    <strong>Tailles :</strong>
                    <span>{format.tailles.join(", ")}</span>
                  </div>
                  <div className="publicite-detail">
                    <strong>Cible idéale :</strong>
                    <span>{format.cible}</span>
                  </div>
                  <div className="publicite-detail">
                    <strong>Tarif :</strong>
                    <span className="publicite-tarif">{format.tarif}</span>
                  </div>
                </div>

                <button
                  className="publicite-format-cta"
                  type="button"
                  style={{ background: format.couleur }}
                >
                  Demander un devis →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AVANTAGES ── */}
      <section className="publicite-avantages">
        <div className="publicite-avantages-inner">
          <h2 className="publicite-section-title">Pourquoi choisir ChaletPedia ?</h2>
          <p className="publicite-section-sub">
            Nous offrons bien plus qu'un simple espace publicitaire.
          </p>

          <div className="publicite-avantages-grid">
            {avantages.map((avantage) => (
              <div key={avantage.titre} className="publicite-avantage-card">
                <div className="publicite-avantage-icon">{avantage.icon}</div>
                <h3 className="publicite-avantage-titre">{avantage.titre}</h3>
                <p className="publicite-avantage-desc">{avantage.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section className="publicite-processus">
        <div className="publicite-processus-inner">
          <h2 className="publicite-section-title">Notre processus en 4 étapes</h2>

          <div className="publicite-processus-etapes">
            <div className="publicite-etape">
              <div className="publicite-etape-num">1</div>
              <h3 className="publicite-etape-titre">Analyse de vos besoins</h3>
              <p className="publicite-etape-desc">
                Nous étudions vos objectifs, votre cible et votre budget pour
                vous proposer la solution optimale.
              </p>
            </div>
            <div className="publicite-etape">
              <div className="publicite-etape-num">2</div>
              <h3 className="publicite-etape-titre">Proposition sur mesure</h3>
              <p className="publicite-etape-desc">
                Nous vous présentons un devis détaillé avec recommandations et
                prévisions de performance.
              </p>
            </div>
            <div className="publicite-etape">
              <div className="publicite-etape-num">3</div>
              <h3 className="publicite-etape-titre">Création & validation</h3>
              <p className="publicite-etape-desc">
                Nous créons vos visuels et contenus, et les validons avec vous
                avant publication.
              </p>
            </div>
            <div className="publicite-etape">
              <div className="publicite-etape-num">4</div>
              <h3 className="publicite-etape-titre">Suivi & optimisation</h3>
              <p className="publicite-etape-desc">
                Nous suivons les performances et optimisons en temps réel pour
                maximiser votre ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA CONTACT ── */}
      <section className="publicite-contact-cta">
        <div className="publicite-contact-cta-inner">
          <h2 className="publicite-contact-title">Prêt à lancer votre campagne ?</h2>
          <p className="publicite-contact-sub">
            Contactez notre équipe partenariats pour discuter de vos objectifs
            et obtenir un devis personnalisé.
          </p>
          <a href="mailto:publicite@chaletpedia.com" className="publicite-contact-btn">
            Contacter l'équipe publicité →
          </a>
        </div>
      </section>
    </div>
  );
}

// src/pages/Formations.jsx
// ============================================================
// PAGE FORMATIONS (/formations/)
// Formations pour propriétaires de chalets locatifs.
// ============================================================

export default function Formations() {
  const formations = [
    {
      id: "debutant",
      niveau: "Débutant",
      titre: "Lancer sa location de chalet",
      description:
        "Les bases pour bien débuter : légalité, préparation du chalet, création d'une fiche attractive, tarification et premières réservations.",
      prix: "Gratuit",
      duree: "2h30",
      format: "Vidéo + PDF",
      points: [
        "Obtenir son numéro CITQ",
        "Rédiger une description efficace",
        "Prendre des photos professionnelles",
        "Définir ses premières règles",
      ],
      couleur: "#1f4d3a",
    },
    {
      id: "intermediaire",
      niveau: "Intermédiaire",
      titre: "Optimiser ses revenus locatifs",
      description:
        "Stratégies pour augmenter son taux d'occupation, maximiser ses revenus et fidéliser ses clients.",
      prix: "149 $",
      duree: "4h",
      format: "Vidéo + Templates + Coaching",
      points: [
        "Analyse de marché et tarification dynamique",
        "Gestion de calendrier et surbooking",
        "Marketing saisonnier et promotions",
        "Augmenter ses avis 5 étoiles",
      ],
      couleur: "#2a6b50",
    },
    {
      id: "avance",
      niveau: "Avancé",
      titre: "Gestion professionnelle de plusieurs chalets",
      description:
        "Pour les propriétaires de plusieurs chalets ou ceux souhaitant en faire une activité à temps plein.",
      prix: "349 $",
      duree: "6h",
      format: "Masterclass + Outils + Support VIP",
      points: [
        "Automatisation des processus",
        "Gestion d'équipe de nettoyage",
        "Stratégie d'acquisition d'autres chalets",
        "Optimisation fiscale et légale",
      ],
      couleur: "#0f0f0f",
    },
    {
      id: "photo",
      niveau: "Spécialisation",
      titre: "Photographie pour chalets locatifs",
      description:
        "Apprenez à prendre des photos professionnelles avec votre smartphone pour augmenter vos réservations de 40 %.",
      prix: "79 $",
      duree: "1h30",
      format: "Tutoriel vidéo + Checklist",
      points: [
        "Matériel recommandé (smartphone)",
        "Composition et cadrage",
        "Éclairage naturel et artificiel",
        "Retouches simples et efficaces",
      ],
      couleur: "#4a3a1f",
    },
  ];

  const temoignages = [
    {
      nom: "Marie‑Claude",
      chalet: "Chalet des Érables, Laurentides",
      texte: "La formation débutant m'a évité tellement d'erreurs ! J'ai obtenu mon numéro CITQ en 2 semaines et loué mon chalet 8 fois le premier mois.",
      note: 5,
    },
    {
      nom: "Philippe",
      chalet: "3 chalets en Estrie",
      texte: "La formation avancé a transformé mon activité. J'ai automatisé 80 % de mes processus et augmenté mes revenus de 60 % en 6 mois.",
      note: 5,
    },
    {
      nom: "Sophie",
      chalet: "Yourtes en Gaspésie",
      texte: "Les conseils en photographie ont changé la donne. Mes nouvelles photos ont augmenté mon taux de réservation de 45 %.",
      note: 5,
    },
  ];

  const stats = [
    { num: "500+", label: "propriétaires formés" },
    { num: "98%", label: "satisfaction" },
    { num: "+40%", label: "revenus en moyenne" },
    { num: "24/7", label: "support après formation" },
  ];

  return (
    <div className="formations-page">
      {/* ── HERO ── */}
      <section className="formations-hero">
        <div className="formations-hero-kicker">ACADÉMIE · CHALETPEDIA</div>
        <h1 className="formations-hero-title">
          Formez‑vous pour <span className="formations-hero-accent">louer mieux</span>
        </h1>
        <p className="formations-hero-sub">
          Nos formations concrètes et adaptées au marché québécois vous donnent
          les outils pour maximiser vos revenus, gérer efficacement et éviter
          les pièges.
        </p>
      </section>

      {/* ── STATS ── */}
      <section className="formations-stats">
        <div className="formations-stats-inner">
          {stats.map((stat) => (
            <div key={stat.label} className="formations-stat">
              <span className="formations-stat-num">{stat.num}</span>
              <span className="formations-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORMATIONS ── */}
      <section className="formations-list">
        <div className="formations-list-inner">
          <h2 className="formations-section-title">Nos formations</h2>
          <p className="formations-section-sub">
            Choisissez la formation qui correspond à votre niveau et à vos
            objectifs.
          </p>

          <div className="formations-grid">
            {formations.map((formation) => (
              <div
                key={formation.id}
                className="formation-card"
                style={{ borderTopColor: formation.couleur }}
              >
                <div className="formation-badge">
                  <span className="formation-niveau">{formation.niveau}</span>
                  <span className="formation-prix">{formation.prix}</span>
                </div>
                <h3 className="formation-titre">{formation.titre}</h3>
                <p className="formation-desc">{formation.description}</p>

                <div className="formation-meta">
                  <span className="formation-meta-item">
                    <strong>Durée :</strong> {formation.duree}
                  </span>
                  <span className="formation-meta-item">
                    <strong>Format :</strong> {formation.format}
                  </span>
                </div>

                <ul className="formation-points">
                  {formation.points.map((point, idx) => (
                    <li key={idx} className="formation-point">
                      <span className="formation-point-icon">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>

                <button className="formation-cta" type="button">
                  {formation.prix === "Gratuit"
                    ? "Commencer gratuitement →"
                    : "Découvrir la formation →"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMOIGNAGES ── */}
      <section className="formations-temoignages">
        <div className="formations-temoignages-inner">
          <h2 className="formations-section-title">Ils ont suivi nos formations</h2>
          <p className="formations-section-sub">
            Découvrez les retours de propriétaires qui ont transformé leur
            activité grâce à nos formations.
          </p>

          <div className="temoignages-grid">
            {temoignages.map((temoignage, idx) => (
              <div key={idx} className="temoignage-card">
                <div className="temoignage-notes">
                  {[...Array(temoignage.note)].map((_, i) => (
                    <span key={i} className="temoignage-etoile" aria-hidden="true">
                      ★
                    </span>
                  ))}
                </div>
                <p className="temoignage-texte">« {temoignage.texte} »</p>
                <div className="temoignage-auteur">
                  <strong>{temoignage.nom}</strong>
                  <span>{temoignage.chalet}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="formations-faq">
        <div className="formations-faq-inner">
          <h2 className="formations-section-title">Questions fréquentes</h2>

          <div className="faq-items">
            <div className="faq-item">
              <h3 className="faq-question">Les formations sont-elles remboursables ?</h3>
              <p className="faq-answer">
                Oui, toutes nos formations sont couvertes par une garantie
                satisfait ou remboursé de 30 jours. Si vous n'êtes pas satisfait,
                nous vous remboursons intégralement.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Pendant combien de temps ai-je accès ?</h3>
              <p className="faq-answer">
                Accès à vie ! Une fois achetée, la formation reste accessible
                dans votre compte, avec toutes les mises à jour futures
                incluses.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Y a-t-il du support après la formation ?</h3>
              <p className="faq-answer">
                Oui, toutes nos formations incluent un support par email pendant
                30 jours. Les formations avancées incluent une séance de coaching
                individuelle.
              </p>
            </div>
            <div className="faq-item">
              <h3 className="faq-question">Les formations sont-elles à jour avec la loi ?</h3>
              <p className="faq-answer">
                Absolument. Nous mettons à jour nos formations dès qu'il y a un
                changement législatif au Québec (CITQ, taxes, etc.).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="formations-final-cta">
        <div className="formations-final-cta-inner">
          <h2 className="formations-final-title">Prêt à transformer votre activité ?</h2>
          <p className="formations-final-sub">
            Commencez par la formation gratuite et découvrez comment maximiser
            vos revenus locatifs dès maintenant.
          </p>
          <button className="formations-final-btn" type="button">
            Commencer gratuitement →
          </button>
        </div>
      </section>
    </div>
  );
}

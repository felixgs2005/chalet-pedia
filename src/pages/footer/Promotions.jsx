// src/pages/footer/Promotions.jsx
// ============================================================
// PAGE PROMOTIONS (/promotions/)
// Services marketing pour propriétaires de chalets locatifs.
// Structure calquée sur chaletpedia.com/promotions/
// ============================================================

import { Link } from "react-router-dom";

const SERVICES = [
  {
    id: "reseaux",
    emoji: "✨",
    titre: "Publication épinglée sur les médias sociaux",
    sousTitre: "1 mois · 65 000 abonnés · portée de 1,2 million",
    desc: "Pendant un mois entier, votre chalet sera en première ligne sur nos réseaux sociaux, atteignant plus de 65 000 abonnés et générant une portée globale de 1,2 million de personnes. Démarquez-vous de la concurrence et captez l'attention des voyageurs en quête de leur prochaine escapade.",
    exemple: "« Découvrez le Chalet des Étoiles, un havre de paix avec vue imprenable sur le lac. Réservez dès maintenant pour un séjour mémorable ! »",
    cta: "Réservez votre publication épinglée",
  },
  {
    id: "seo",
    emoji: "📝",
    titre: "Article de blog de 1 000 mots",
    sousTitre: "Référencement optimal sur Google",
    desc: "Renforcez votre présence en ligne avec un article richement rédigé et optimisé pour Google. En intégrant des mots-clés stratégiques, nous mettons en valeur votre chalet pour capter l'attention des visiteurs et améliorer votre classement dans les recherches.",
    exemple: "« Le Chalet des Sommets vous offre une expérience luxueuse avec ses vues panoramiques et ses équipements modernes. Découvrez pourquoi c'est le choix parfait pour votre prochaine aventure. »",
    cta: "Demandez votre article SEO",
  },
  {
    id: "rabais",
    emoji: "💡",
    titre: "Publiez vos rabais et offres de dernières minutes",
    sousTitre: "Page dédiée aux promotions",
    desc: "Stimulez vos réservations en affichant des promotions captivantes et des offres de dernière minute. Mettez en avant vos meilleures réductions pour séduire les voyageurs à la recherche de bonnes affaires et offrez-leur une valeur ajoutée qui les incitera à réserver.",
    exemple: "« Réservez maintenant au Chalet des Rêves et profitez de 20 % de réduction pour les séjours réservés cette semaine seulement ! »",
    cta: "Publier mes offres",
  },
  {
    id: "accueil",
    emoji: "🏡",
    titre: "Affichage sur la page d'accueil et top recherches",
    sousTitre: "Visibilité maximale sur le site",
    desc: "Profitez d'une visibilité optimale ! Placez votre chalet en première ligne sur notre site web, en vue auprès de tous nos visiteurs. Un emplacement privilégié sur la page d'accueil augmente considérablement vos chances de réservation.",
    exemple: "« Le Chalet du Bord du Lac, avec son accès direct au lac et ses conforts modernes, vous attend pour une expérience inoubliable. »",
    cta: "Mettre mon chalet en avant",
  },
  {
    id: "video",
    emoji: "🎥",
    titre: "Création et diffusion de courtes vidéos",
    sousTitre: "Réels engageants sur nos réseaux",
    desc: "Transformez l'image de votre chalet avec de courtes vidéos dynamiques. Ces contenus engageants attireront un large public lorsque vous les partagerez sur nos réseaux sociaux, tout en mettant en avant les caractéristiques uniques de votre propriété.",
    exemple: "« Découvrez le Chalet des Bois en 30 secondes : un refuge parfait avec des vues imprenables et un intérieur chaleureux. »",
    cta: "Créer ma vidéo",
  },
];

const STATS = [
  { num: "65 000", label: "abonnés sur nos réseaux" },
  { num: "1,2 M", label: "de portée mensuelle" },
  { num: "5", label: "leviers marketing" },
  { num: "100%", label: "dédié aux chalets québécois" },
];

const ATOUTS = [
  {
    icon: "🎯",
    titre: "Au-delà des promotions tarifaires",
    desc: "La plupart des concurrents misent sur des réductions. ChaletPedia se démarque avec une stratégie digitale complète : SEO, social, placement premium, vidéo et contenu.",
  },
  {
    icon: "🚀",
    titre: "Croissance durable",
    desc: "Nos services visent une augmentation durable des réservations via une stratégie marketing multicanal sophistiquée, pas seulement un pic ponctuel.",
  },
  {
    icon: "📊",
    titre: "Résultats mesurables",
    desc: "Chaque service est accompagné de métriques claires : portée, impressions, clics, réservations générées. Vous voyez concrètement l'impact.",
  },
];

export default function Promotions() {
  return (
    <div className="promo-page">

      {/* ── HERO ── */}
      <section className="promo-hero">
        <div className="promo-hero-inner">
          <div className="promo-hero-kicker">PROPRIÉTAIRES · CHALETPEDIA</div>
          <h1 className="promo-hero-title">Services marketing</h1>
          <p className="promo-hero-sub">
            Libérez tout le potentiel de votre chalet avec nos services
            exceptionnels — une transformation numérique complète et une
            visibilité multicanal pour augmenter vos réservations.
          </p>
          <Link to="/submit-listing/details/" className="promo-hero-cta">
            Réservez nos services →
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="promo-stats-band">
        {STATS.map((s) => (
          <div key={s.label} className="promo-stat">
            <span className="promo-stat-num">{s.num}</span>
            <span className="promo-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── STRATÉGIE ── */}
      <section className="promo-strategy">
        <div className="promo-strategy-inner">
          <div className="promo-strategy-text">
            <div className="promo-strategy-kicker">Notre approche</div>
            <h2 className="promo-strategy-title">Stratégie marketing complète</h2>
            <p className="promo-strategy-desc">
              Notre approche va bien au-delà des promotions tarifaires classiques.
              ChaletPedia se démarque avec une stratégie digitale incluant SEO,
              visibilité sociale, placement premium, vidéos engageantes et
              contenu optimisé.
            </p>
            <ul className="promo-strategy-list">
              <li>Publication épinglée 1 mois — 65 000 abonnés, portée 1,2 million</li>
              <li>Article de blog 1 000 mots optimisé pour Google</li>
              <li>Publication de vos rabais et offres de dernières minutes</li>
              <li>Affichage page d'accueil et top recherches</li>
              <li>Création et diffusion de courtes vidéos engageantes</li>
            </ul>
          </div>
          <div className="promo-strategy-atouts">
            {ATOUTS.map((a) => (
              <div key={a.titre} className="promo-atout-card">
                <span className="promo-atout-icon">{a.icon}</span>
                <div>
                  <h3 className="promo-atout-titre">{a.titre}</h3>
                  <p className="promo-atout-desc">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="promo-services">
        <div className="promo-services-inner">
          <h2 className="promo-services-title">Nos services en détail</h2>
          <p className="promo-services-sub">
            Cinq leviers complémentaires pour maximiser la visibilité de votre chalet.
          </p>

          <div className="promo-services-list">
            {SERVICES.map((service, idx) => (
              <div key={service.id} className={`promo-service-row${idx % 2 === 1 ? " promo-service-row--alt" : ""}`}>
                <div className="promo-service-num">0{idx + 1}</div>
                <div className="promo-service-body">
                  <div className="promo-service-header">
                    <span className="promo-service-emoji" aria-hidden="true">{service.emoji}</span>
                    <div>
                      <h3 className="promo-service-titre">{service.titre}</h3>
                      <div className="promo-service-sous">{service.sousTitre}</div>
                    </div>
                  </div>
                  <p className="promo-service-desc">{service.desc}</p>
                  <div className="promo-service-exemple">
                    <span className="promo-exemple-label">Exemple</span>
                    <p>{service.exemple}</p>
                  </div>
                  <Link to="/promotions/" className="promo-service-cta">
                    {service.cta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITATION FONDATEUR ── */}
      <section className="promo-quote">
        <div className="promo-quote-inner">
          <div className="promo-quote-bar" aria-hidden="true" />
          <blockquote className="promo-quote-text">
            Un article bien placé sur Google peut vous rapporter des milliers
            de visiteurs qualifiés par an… sans aucun frais publicitaire.
          </blockquote>
          <div className="promo-quote-author">
            <div className="promo-quote-avatar">NR</div>
            <div>
              <strong>Nicolas Roy</strong>
              <span>Fondateur · ChaletPedia</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="promo-final-cta">
        <div className="promo-final-inner">
          <div className="promo-final-kicker">PASSEZ À L'ACTION</div>
          <h2 className="promo-final-title">Donnez vie à votre chalet</h2>
          <p className="promo-final-sub">
            Ne manquez pas l'opportunité de démarquer votre chalet sur le marché.
            Profitez de nos services pour attirer des clients qualifiés et
            générer des réservations facilement.
          </p>
          <Link to="/submit-listing/details/" className="promo-final-btn">
            Réservez nos services marketing →
          </Link>
        </div>
      </section>

    </div>
  );
}

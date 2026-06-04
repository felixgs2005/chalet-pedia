import { Link } from "react-router-dom";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import "../../styles/promotions.css";

const MAIL = "info@chaletpedia.com";

const STATS = [
  { num: "65 000", label: "abonnés réseaux sociaux" },
  { num: "1,2 M", label: "personnes touchées / mois" },
  { num: "5", label: "formats au choix" },
  { num: "QC", label: "marché québécois" },
];

const POURQUOI = [
  {
    num: "01",
    titre: "Plus qu'un rabais sur Airbnb",
    desc: "On combine visibilité sur le site, contenu Google et réseaux sociaux — pas seulement une promo de dernière minute.",
  },
  {
    num: "02",
    titre: "Des réservations sur la durée",
    desc: "L'objectif, c'est de remplir votre calendrier régulièrement, pas de faire un pic une semaine puis plus rien.",
  },
  {
    num: "03",
    titre: "Vous voyez ce que ça donne",
    desc: "Portée, clics, impressions : on vous montre les chiffres pour que vous puissiez ajuster.",
  },
];

const SERVICES = [
  {
    id: "reseaux",
    tag: "Réseaux sociaux",
    titre: "Publication épinglée",
    meta: "1 mois · ~65 000 abonnés",
    desc: "Votre chalet reste en tête sur nos comptes pendant un mois. Idéal pour lancer une saison ou une nouvelle annonce.",
    quote:
      "« Découvrez le chalet des Étoiles : vue sur le lac, spa et calme absolu — réservez avant la fin du mois. »",
    cta: "Réserver une publication",
    wide: true,
  },
  {
    id: "seo",
    tag: "Référencement",
    titre: "Article de blog (~1 000 mots)",
    meta: "Optimisé pour Google",
    desc: "Un texte rédigé pour vous, avec les bons mots-clés, qui présente votre chalet aux gens qui cherchent sur Google.",
    quote:
      "« Pourquoi le Chalet des Sommets est notre coup de cœur pour un long week-end en Mauricie. »",
    cta: "Demander un article",
  },
  {
    id: "rabais",
    tag: "Offres",
    titre: "Rabais et dernières minutes",
    meta: "Page promotions du site",
    desc: "Affichez vos réductions là où les voyageurs les cherchent déjà — parfait pour combler des dates libres.",
    quote:
      "« −20 % sur les séjours réservés cette semaine au Chalet des Rêves. »",
    cta: "Publier une offre",
  },
  {
    id: "accueil",
    tag: "Site web",
    titre: "Page d'accueil et top recherches",
    meta: "Visibilité premium",
    desc: "Votre annonce apparaît là où presque tout le monde commence sa recherche sur ChaletPedia.",
    quote:
      "« Le Chalet du Bord du Lac : accès direct à l'eau, kayaks inclus. »",
    cta: "Mettre en avant",
  },
  {
    id: "video",
    tag: "Vidéo",
    titre: "Courte vidéo sur nos réseaux",
    meta: "Format réel / courte durée",
    desc: "Une vidéo qui montre l'ambiance de votre chalet en quelques secondes — souvent plus parlant qu'une dizaine de photos.",
    quote:
      "« 30 secondes au Chalet des Bois : feu, lac et grand salon lumineux. »",
    cta: "Parler vidéo",
    wide: true,
  },
];

function RevealSection({ className = "", children, delay = 0 }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`prm-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export default function Promotions() {
  const mail = (sujet) =>
    `mailto:${MAIL}?subject=${encodeURIComponent(sujet)}`;

  return (
    <div className="prm-page">
      <header className="prm-hero">
        <div className="prm-hero__glow" aria-hidden="true" />
        <div className="prm-hero__inner">
          <p className="prm-eyebrow">Pour les propriétaires</p>
          <h1 className="prm-hero__title">Mettez votre chalet en avant</h1>
          <p className="prm-hero__lead">
            Réseaux sociaux, blogue, page d&apos;accueil ou rabais de dernière minute — on
            vous aide à remplir votre calendrier, avec des services pensés pour le marché
            québécois.
          </p>
          <a href={mail("Services marketing — mon chalet")} className="prm-btn prm-btn--primary">
            Écrire à l&apos;équipe
          </a>
          <p className="prm-hero__note">
            Vous avez déjà une annonce ?{" "}
            <Link to="/submit-listing/details/" style={{ color: "#a8d4bc" }}>
              Publiez-la d&apos;abord
            </Link>
          </p>
        </div>
      </header>

      <div className="prm-stats-band" aria-label="En bref">
        {STATS.map((s) => (
          <div key={s.label} className="prm-stats-band__item">
            <span className="prm-stats-band__num">{s.num}</span>
            <span className="prm-stats-band__label">{s.label}</span>
          </div>
        ))}
      </div>

      <RevealSection className="prm-why">
        <div className="prm-why__inner">
          <div>
            <p className="prm-eyebrow prm-eyebrow--dark">Pourquoi passer par nous</p>
            <h2 className="prm-section-title">Une vraie stratégie, pas juste un prix barré</h2>
            <p className="prm-section-lead">
              Beaucoup de propriétaires baissent leurs tarifs et espèrent le meilleur. Nous,
              on travaille la visibilité : là où les gens cherchent un chalet, lisent et
              décident.
            </p>
            <ul className="prm-why__list">
              <li>Publication épinglée un mois sur nos réseaux</li>
              <li>Article de blog optimisé pour Google</li>
              <li>Page promotions pour vos rabais</li>
              <li>Emplacement page d&apos;accueil et recherches populaires</li>
              <li>Vidéos courtes diffusées sur nos comptes</li>
            </ul>
          </div>
          <div className="prm-why__cards">
            {POURQUOI.map((item) => (
              <div key={item.num} className="prm-why__card">
                <span className="prm-why__num">{item.num}</span>
                <div>
                  <h3 className="prm-why__card-title">{item.titre}</h3>
                  <p className="prm-why__card-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="prm-services" delay={60}>
        <div className="prm-services__inner" id="prm-services">
          <div className="prm-services__header">
            <h2 className="prm-section-title">Ce qu&apos;on propose</h2>
            <p className="prm-section-lead prm-section-lead--center">
              Cinq formats complémentaires. On peut en combiner plusieurs selon votre
              saison et votre budget.
            </p>
          </div>

          <div className="prm-services__grid">
            {SERVICES.map((service, index) => (
              <article
                key={service.id}
                className={`prm-service${service.wide ? " prm-service--wide" : ""}`}
                style={{ "--i": index }}
              >
                <span className="prm-service__tag">{service.tag}</span>
                <h3 className="prm-service__title">{service.titre}</h3>
                <p className="prm-service__meta">{service.meta}</p>
                <p className="prm-service__desc">{service.desc}</p>
                <p className="prm-service__quote">{service.quote}</p>
                <a
                  href={mail(`Promotions — ${service.titre}`)}
                  className="prm-service__link"
                >
                  {service.cta} →
                </a>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <section className="prm-quote">
        <div className="prm-quote__inner">
          <div className="prm-quote__bar" aria-hidden="true" />
          <blockquote className="prm-quote__text">
            Un bon article sur Google peut vous apporter des visiteurs toute l&apos;année —
            sans payer chaque clic en publicité.
          </blockquote>
          <div className="prm-quote__author">
            <div className="prm-quote__avatar" aria-hidden="true">
              NR
            </div>
            <div>
              <span className="prm-quote__name">Nicolas Roy</span>
              <span className="prm-quote__role">Fondateur</span>
            </div>
          </div>
        </div>
      </section>

      <section className="prm-cta">
        <div className="prm-cta__inner prm-reveal is-visible">
          <h2 className="prm-cta__title">On en parle ?</h2>
          <p className="prm-cta__lead">
            Décrivez-nous votre chalet et vos objectifs (saison à combler, lancement,
            etc.). On vous répond avec une proposition claire.
          </p>
          <a href={mail("Services marketing ChaletPedia")} className="prm-btn prm-btn--cta">
            {MAIL}
          </a>
        </div>
      </section>
    </div>
  );
}

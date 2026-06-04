import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";
import "../../styles/publicite.css";

const MAIL = "publicite@chaletpedia.com";

const STATS = [
  { num: "50 000+", label: "visites mensuelles" },
  { num: "70 %", label: "taux de retour" },
  { num: "3 min", label: "temps moyen / session" },
  { num: "25–55 ans", label: "cœur de cible" },
];

const AUDIENCE = [
  { label: "Propriétaires de chalets", pct: 40 },
  { label: "Locataires en recherche", pct: 35 },
  { label: "Professionnels du secteur", pct: 15 },
  { label: "Passionnés déco & aménagement", pct: 10 },
];

const FORMATS = [
  {
    id: "banniere",
    tag: "Visibilité",
    titre: "Bannières publicitaires",
    description:
      "Emplacements sur l’accueil, les résultats de recherche et les fiches chalets — là où les voyageurs décident.",
    meta: ["970×250 · 728×90 · 300×600", "Tourisme, assurance, équipement"],
    tarif: "À partir de 500 $ / mois",
    featured: true,
  },
  {
    id: "sponsor",
    tag: "Thématique",
    titre: "Sponsoring de catégorie",
    description:
      "Associez votre marque à une expérience : spa, bord de l’eau, A-frame, région précise.",
    meta: ["Message sur la catégorie", "Marques premium, constructeurs"],
    tarif: "À partir de 1 200 $ / mois",
  },
  {
    id: "newsletter",
    tag: "Courriel",
    titre: "Newsletter & campagnes",
    description:
      "Présence dans nos envois mensuels et campagnes ciblées auprès d’abonnés engagés.",
    meta: ["Bannière 600×200 · encart texte", "B2C et B2B"],
    tarif: "À partir de 300 $ / envoi",
  },
  {
    id: "contenu",
    tag: "Éditorial",
    titre: "Contenu sponsorisé",
    description:
      "Articles, guides ou vidéos co-créés, diffusés sur le blogue et les réseaux ChaletPedia.",
    meta: ["Article 800+ mots · vidéo 2–3 min", "Expertise sectorielle"],
    tarif: "Sur devis",
  },
];

const AVANTAGES = [
  {
    num: "01",
    titre: "Audience ciblée",
    desc: "Des gens du Québec qui cherchent un chalet à louer ou qui gèrent le leur — pas une audience générique.",
  },
  {
    num: "02",
    titre: "Données transparentes",
    desc: "Impressions, clics, temps passé : on partage les chiffres avec vous pendant la campagne.",
  },
  {
    num: "03",
    titre: "Accompagnement",
    desc: "On vous aide à choisir le bon format et le bon moment — sans vous noyer dans le jargon pub.",
  },
  {
    num: "04",
    titre: "Objectifs clairs",
    desc: "KPI définis ensemble et bilans réguliers pour ajuster la diffusion.",
  },
];

const ETAPES = [
  {
    titre: "Analyse",
    desc: "Objectifs, cible, budget et calendrier — nous cadrons la campagne avant toute création.",
  },
  {
    titre: "Proposition",
    desc: "Devis détaillé, emplacements recommandés et prévisions de portée.",
  },
  {
    titre: "Création",
    desc: "Visuels et textes validés avec vous avant mise en ligne.",
  },
  {
    titre: "Suivi",
    desc: "Performance en continu et optimisations selon les résultats.",
  },
];

function RevealSection({ className = "", children, delay = 0 }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`pub-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export default function Publicite() {
  const mailDevis = (sujet) =>
    `mailto:${MAIL}?subject=${encodeURIComponent(sujet)}`;

  return (
    <div className="pub-page">
      <header className="pub-hero">
        <div className="pub-hero__glow" aria-hidden="true" />
        <div className="pub-hero__inner">
          <p className="pub-eyebrow">Publicité sur ChaletPedia</p>
          <h1 className="pub-hero__title">
            Touchez les gens qui
            <br />
            <span>cherchent un chalet</span> au Québec
          </h1>
          <p className="pub-hero__lead">
            Bannières sur le site, infolettres, articles sponsorisés — des formats simples
            pour les marques qui veulent parler à des propriétaires et des vacanciers d&apos;ici.
          </p>
          <div className="pub-hero__actions">
            <a href={mailDevis("Demande de devis publicité")} className="pub-btn pub-btn--primary">
              Demander un devis
            </a>
            <a href="#pub-formats" className="pub-btn pub-btn--ghost">
              Voir les formats
            </a>
          </div>
        </div>
      </header>

      <div className="pub-stats-band" aria-label="Chiffres clés">
        {STATS.map((stat) => (
          <div key={stat.label} className="pub-stats-band__item">
            <span className="pub-stats-band__num">{stat.num}</span>
            <span className="pub-stats-band__label">{stat.label}</span>
          </div>
        ))}
      </div>

      <RevealSection className="pub-audience">
        <div className="pub-audience__inner">
          <div className="pub-audience__copy">
            <h2 className="pub-section-title">Une audience engagée</h2>
            <p className="pub-section-lead">
              Des visiteurs qui planifient des séjours, comparent des régions et entretiennent
              leur propriété — le bon moment pour votre message.
            </p>
          </div>
          <div className="pub-audience__chart">
            <p className="pub-audience__chart-title">Répartition de notre trafic</p>
            <ul className="pub-bars">
              {AUDIENCE.map((row) => (
                <li key={row.label} className="pub-bars__row">
                  <div className="pub-bars__head">
                    <span>{row.label}</span>
                    <span className="pub-bars__pct">{row.pct} %</span>
                  </div>
                  <div className="pub-bars__track">
                    <div
                      className="pub-bars__fill"
                      style={{ "--pct": `${row.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </RevealSection>

      <RevealSection className="pub-formats" delay={80}>
        <div className="pub-formats__inner" id="pub-formats">
          <div className="pub-formats__header">
            <h2 className="pub-section-title">Formats publicitaires</h2>
            <p className="pub-section-lead pub-section-lead--center">
              Du bandeau haute visibilité au contenu éditorial — choisissez le levier adapté à
              votre campagne.
            </p>
          </div>

          <div className="pub-formats__grid">
            {FORMATS.map((format, index) => (
              <article
                key={format.id}
                className={`pub-format${format.featured ? " pub-format--featured" : ""}`}
                style={{ "--i": index }}
              >
                <span className="pub-format__tag">{format.tag}</span>
                <h3 className="pub-format__title">{format.titre}</h3>
                <p className="pub-format__desc">{format.description}</p>
                <ul className="pub-format__meta">
                  {format.meta.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <p className="pub-format__price">{format.tarif}</p>
                <a
                  href={mailDevis(`Devis — ${format.titre}`)}
                  className="pub-format__link"
                >
                  Demander un devis →
                </a>
              </article>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="pub-why">
        <div className="pub-why__inner">
          <h2 className="pub-section-title pub-section-title--light">
            Pourquoi annoncer ici
          </h2>
          <p className="pub-section-lead pub-section-lead--light pub-section-lead--center">
            Une audience ciblée, des chiffres clairs et une équipe québécoise qui répond
            vraiment à vos courriels.
          </p>
          <div className="pub-why__grid">
            {AVANTAGES.map((item) => (
              <div key={item.num} className="pub-why__card">
                <span className="pub-why__num">{item.num}</span>
                <h3 className="pub-why__card-title">{item.titre}</h3>
                <p className="pub-why__card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      <RevealSection className="pub-process">
        <div className="pub-process__inner">
          <h2 className="pub-section-title">Notre processus</h2>
          <p className="pub-section-lead pub-section-lead--center">
            Quatre étapes, de la première discussion à l’optimisation en cours de campagne.
          </p>
          <ol className="pub-timeline">
            {ETAPES.map((etape, index) => (
              <li key={etape.titre} className="pub-timeline__step">
                <span className="pub-timeline__index">{String(index + 1).padStart(2, "0")}</span>
                <div className="pub-timeline__body">
                  <h3 className="pub-timeline__title">{etape.titre}</h3>
                  <p className="pub-timeline__desc">{etape.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </RevealSection>

      <section className="pub-cta">
        <div className="pub-cta__inner pub-reveal is-visible">
          <h2 className="pub-cta__title">Une question, un devis ?</h2>
          <p className="pub-cta__lead">
            Écrivez-nous : on revient vers vous en général sous deux jours ouvrables avec une
            proposition adaptée à votre budget.
          </p>
          <a href={mailDevis("Campagne publicitaire ChaletPedia")} className="pub-btn pub-btn--cta">
            {MAIL} →
          </a>
        </div>
      </section>
    </div>
  );
}

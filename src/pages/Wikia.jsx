import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { wikiaCategories, wikiaThemes, wikiaStats } from "../data/wikia";
import "../styles/wikia.css";

const CATEGORY_ABBR = {
  location: "LO",
  construction: "CR",
  decoration: "DE",
  eco: "ÉC",
  fiscalite: "FI",
  vocabulaire: "VO",
};

function RevealSection({ className = "", children, delay = 0 }) {
  const [ref, visible] = useRevealOnScroll();
  return (
    <section
      ref={ref}
      className={`wk-reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </section>
  );
}

export default function Wikia() {
  const [recherche, setRecherche] = useState("");
  const [faqOuverte, setFaqOuverte] = useState(null);

  const query = recherche.trim().toLowerCase();

  const categoriesFiltrees = useMemo(() => {
    if (!query) return wikiaCategories;
    return wikiaCategories.filter(
      (c) =>
        c.titre.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query)
    );
  }, [query]);

  const themesFiltres = useMemo(() => {
    if (!query) return wikiaThemes;
    return wikiaThemes.filter(
      (t) =>
        t.titre.toLowerCase().includes(query) ||
        t.faq.some(
          (f) =>
            f.q.toLowerCase().includes(query) || f.r.toLowerCase().includes(query)
        ) ||
        t.articles.some((a) => a.titre.toLowerCase().includes(query))
    );
  }, [query]);

  const toggleFaq = (key) => setFaqOuverte(faqOuverte === key ? null : key);

  const navCategories =
    query && categoriesFiltrees.length === 0
      ? wikiaCategories.filter((c) => wikiaThemes.some((t) => t.id === c.id))
      : categoriesFiltrees.length > 0
        ? categoriesFiltrees
        : wikiaCategories;

  return (
    <div className="wk-page">
      <header className="wk-hero">
        <div className="wk-hero__glow" aria-hidden="true" />
        <div className="wk-hero__inner">
          <nav className="wk-breadcrumb" aria-label="Fil d'Ariane">
            <span>Académie</span>
            <span aria-hidden="true">/</span>
            <strong>Wiki des chalets</strong>
          </nav>

          <p className="wk-eyebrow">Base de connaissances</p>
          <h1 className="wk-hero__title">
            Tout savoir sur les chalets au Québec
          </h1>
          <p className="wk-hero__lead">
            Location, construction, déco, fiscalité… des réponses claires, rédigées pour
            le marché d&apos;ici — pas un wiki générique traduit de l&apos;anglais.
          </p>

          <div className="wk-search">
            <div className="wk-search__bar">
              <span className="wk-search__icon" aria-hidden="true" />
              <input
                type="search"
                className="wk-search__input"
                placeholder="Rechercher une catégorie, une question…"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                aria-label="Rechercher dans le wiki"
              />
              {recherche && (
                <button
                  type="button"
                  className="wk-search__clear"
                  onClick={() => setRecherche("")}
                  aria-label="Effacer la recherche"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="wk-hero__visual" aria-hidden="true">
          <div className="wk-stack">
            <div className="wk-stack__card">
              <span className="wk-stack__label">Location</span>
              <span className="wk-stack__line" />
              <span className="wk-stack__line wk-stack__line--short" />
            </div>
            <div className="wk-stack__card">
              <span className="wk-stack__label">Construction</span>
              <span className="wk-stack__line" />
              <span className="wk-stack__line" />
            </div>
            <div className="wk-stack__card">
              <span className="wk-stack__label">Déco</span>
              <span className="wk-stack__line wk-stack__line--short" />
              <span className="wk-stack__line" />
            </div>
          </div>
        </div>
      </header>

      <div className="wk-stats-band" aria-label="Statistiques du wiki">
        {wikiaStats.map((s) => (
          <div key={s.label} className="wk-stats-band__item">
            <span className="wk-stats-band__num">{s.num}</span>
            <span className="wk-stats-band__label">{s.label}</span>
          </div>
        ))}
      </div>

      <nav className="wk-nav" aria-label="Catégories du wiki">
        <div className="wk-nav__inner">
          {navCategories.map((cat) => (
            <a key={cat.id} href={`#theme-${cat.id}`} className="wk-nav__pill">
              {cat.titre}
            </a>
          ))}
        </div>
      </nav>

      <RevealSection className="wk-categories">
        <div className="wk-categories__inner">
          <h2 className="wk-section-title">Par où commencer ?</h2>
          <p className="wk-section-lead">
            Choisissez un sujet : location, travaux, déco, éco, impôts ou vocabulaire du
            milieu.
          </p>

          {categoriesFiltrees.length > 0 ? (
            <div className="wk-categories__grid">
              {categoriesFiltrees.map((cat, i) => (
                <a
                  key={cat.id}
                  href={`#theme-${cat.id}`}
                  className="wk-cat"
                  style={{ "--i": i }}
                >
                  <div
                    className="wk-cat__badge"
                    style={{ background: cat.couleur }}
                  >
                    {CATEGORY_ABBR[cat.id] ?? cat.id.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="wk-cat__body">
                    <h3 className="wk-cat__title">{cat.titre}</h3>
                    <p className="wk-cat__desc">{cat.description}</p>
                  </div>
                  <span className="wk-cat__arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="wk-empty">
              <p>Aucune catégorie ne correspond à « {recherche} ».</p>
              <button
                type="button"
                className="wk-empty__btn"
                onClick={() => setRecherche("")}
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </RevealSection>

      <RevealSection className="wk-contribute" delay={60}>
        <div className="wk-contribute__inner">
          <div>
            <h2 className="wk-contribute__title">Vous avez de l&apos;expérience à partager ?</h2>
            <p className="wk-contribute__desc">
              Propriétaire, constructeur ou décorateur : proposez une question-réponse ou un
              court article. On le relit avant publication.
            </p>
          </div>
          <a href="mailto:info@chaletpedia.com" className="wk-btn wk-btn--primary">
            Proposer un article
          </a>
        </div>
      </RevealSection>

      <RevealSection className="wk-themes" delay={80}>
        <div className="wk-themes__inner">
          <h2 className="wk-section-title">Questions fréquentes et articles</h2>
          <p className="wk-section-lead">
            On répond aux questions qu&apos;on nous pose le plus souvent, avec des liens
            vers des guides plus longs quand c&apos;est pertinent.
          </p>

          {themesFiltres.length > 0 ? (
            themesFiltres.map((theme) => (
              <article
                key={theme.id}
                id={`theme-${theme.id}`}
                className="wk-theme"
              >
                <div className="wk-theme__head">
                  <h3 className="wk-theme__title">{theme.titre}</h3>
                  <span className="wk-theme__tag">Lecture</span>
                </div>

                <div className="wk-theme__grid">
                  <div>
                    <p className="wk-col-label">Questions fréquentes</p>
                    <div className="wk-faq">
                      {theme.faq.map((item, i) => {
                        const key = `${theme.id}-${i}`;
                        const ouvert = faqOuverte === key;
                        return (
                          <div
                            key={key}
                            className={`wk-faq__item${ouvert ? " is-open" : ""}`}
                          >
                            <button
                              type="button"
                              className="wk-faq__q"
                              onClick={() => toggleFaq(key)}
                              aria-expanded={ouvert}
                            >
                              <span>{item.q}</span>
                              <span className="wk-faq__icon" aria-hidden="true">
                                +
                              </span>
                            </button>
                            {ouvert && (
                              <div className="wk-faq__a">
                                <p>{item.r}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p className="wk-col-label">Articles</p>
                    <ul className="wk-articles">
                      {theme.articles.map((art) => (
                        <li key={art.titre} className="wk-article">
                          <Link to={art.slug} className="wk-article__link">
                            <span className="wk-article__dot" aria-hidden="true" />
                            <span>{art.titre}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    {theme.ressources?.length > 0 && (
                      <>
                        <p className="wk-col-label" style={{ marginTop: 24 }}>
                          Ressources
                        </p>
                        <ul className="wk-ressources">
                          {theme.ressources.map((r) => (
                            <li key={r.label}>
                              <a
                                href={r.url}
                                target={
                                  r.url.startsWith("http") ? "_blank" : undefined
                                }
                                rel={
                                  r.url.startsWith("http")
                                    ? "noopener noreferrer"
                                    : undefined
                                }
                              >
                                {r.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="wk-empty">
              <p>Aucun thème ne correspond à « {recherche} ».</p>
              <button
                type="button"
                className="wk-empty__btn"
                onClick={() => setRecherche("")}
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </RevealSection>

      <RevealSection className="wk-cta" delay={100}>
        <div className="wk-cta__inner">
          <h2 className="wk-cta__title">Envie d&apos;aller plus loin ?</h2>
          <p className="wk-cta__lead">
            Le wiki explique les concepts. Nos astuces proposent des gestes concrets pour
            mieux louer ou entretenir votre chalet.
          </p>
          <Link to="/academie/astuces/" className="wk-btn wk-btn--cta">
            Lire les astuces
          </Link>
        </div>
      </RevealSection>
    </div>
  );
}

// src/pages/Wikia.jsx
// ============================================================
// PAGE WIKIA — /academie/astuces/Wikia
// Wiki de connaissances sur l'univers du chalet au Québec.
// Inspiré de chaletpedia.com/guides/
// ============================================================

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { wikiaCategories, wikiaThemes, wikiaStats } from "../data/wikia";

export default function Wikia() {
  const [recherche, setRecherche] = useState("");
  const [faqOuverte, setFaqOuverte] = useState(null);

  const categoriesFiltrees = useMemo(() => {
    if (!recherche.trim()) return wikiaCategories;
    const q = recherche.toLowerCase();
    return wikiaCategories.filter(
      (c) =>
        c.titre.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [recherche]);

  const toggleFaq = (key) => setFaqOuverte(faqOuverte === key ? null : key);

  return (
    <div className="wikia-page">
      {/* ── HERO ── */}
      <section className="wikia-hero">
        <div className="wikia-hero-kicker">ACADÉMIE · CHALETPEDIA</div>
        <h1 className="wikia-hero-title">
          Wiki Chalet<span className="wikia-hero-title-accent">Nova</span>
        </h1>
        <p className="wikia-hero-sub">
          Guides pratiques, définitions, tutoriels, normes, styles, législation
          et plus encore — le savoir des chalets, centralisé.
        </p>

        {/* Barre de recherche */}
        <div className="wikia-search-wrap">
          <div className="wikia-search-bar">
            <span className="wikia-search-icon" aria-hidden="true">🔍</span>
            <input
              type="search"
              className="wikia-search-input"
              placeholder="Rechercher une catégorie, un sujet…"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              aria-label="Rechercher dans le wiki"
            />
            {recherche && (
              <button
                className="wikia-search-clear"
                onClick={() => setRecherche("")}
                aria-label="Effacer la recherche"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="wikia-stats">
          {wikiaStats.map((s) => (
            <div key={s.label} className="wikia-stat">
              <span className="wikia-stat-num">{s.num}</span>
              <span className="wikia-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── GRILLE CATÉGORIES ── */}
      <section className="wikia-categories-section">
        <div className="wikia-categories-inner">
          <h2 className="wikia-section-title">Explorer par catégorie</h2>

          {categoriesFiltrees.length > 0 ? (
            <div className="wikia-categories-grid">
              {categoriesFiltrees.map((cat, i) => (
                <a
                  key={cat.id}
                  href={`#theme-${cat.id}`}
                  className="wikia-cat-card"
                  style={{ "--card-index": i }}
                >
                  <div className="wikia-cat-icon" style={{ background: cat.couleur }}>
                    <span aria-hidden="true">{cat.icon}</span>
                  </div>
                  <div className="wikia-cat-body">
                    <h3 className="wikia-cat-title">{cat.titre}</h3>
                    <p className="wikia-cat-desc">{cat.description}</p>
                  </div>
                  <span className="wikia-cat-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="wikia-empty">
              <p>Aucune catégorie ne correspond à « {recherche} ».</p>
              <button
                className="wikia-empty-reset"
                onClick={() => setRecherche("")}
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA CONTRIBUER ── */}
      <section className="wikia-contribute">
        <div className="wikia-contribute-inner">
          <div className="wikia-contribute-icon" aria-hidden="true">✍️</div>
          <h2 className="wikia-contribute-title">Contribuez au Wiki ChaletNova</h2>
          <p className="wikia-contribute-sub">
            Vous êtes passionné de chalets, décorateur, constructeur ou
            propriétaire expérimenté ? Aidez-nous à enrichir la base de
            connaissances !
          </p>
          <a href="mailto:info@chaletpedia.com" className="wikia-contribute-btn">
            Proposer un article →
          </a>
        </div>
      </section>

      {/* ── THÈMES DÉTAILLÉS ── */}
      <section className="wikia-themes-section">
        <div className="wikia-themes-inner">
          {wikiaThemes.map((theme) => (
            <div key={theme.id} id={`theme-${theme.id}`} className="wikia-theme-block">
              <h2 className="wikia-theme-title">{theme.titre}</h2>

              <div className="wikia-theme-content">
                {/* FAQ */}
                <div className="wikia-theme-col">
                  <div className="wikia-theme-col-label">FAQ</div>
                  <div className="wikia-faq-list">
                    {theme.faq.map((item, i) => {
                      const key = `${theme.id}-${i}`;
                      const ouvert = faqOuverte === key;
                      return (
                        <div key={key} className={`wikia-faq-item${ouvert ? " open" : ""}`}>
                          <button
                            className="wikia-faq-question"
                            onClick={() => toggleFaq(key)}
                            aria-expanded={ouvert}
                          >
                            <span>{item.q}</span>
                            <span className="wikia-faq-chevron" aria-hidden="true">
                              {ouvert ? "−" : "+"}
                            </span>
                          </button>
                          {ouvert && (
                            <div className="wikia-faq-answer">
                              <p>{item.r}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Articles */}
                <div className="wikia-theme-col">
                  <div className="wikia-theme-col-label">Articles</div>
                  <ul className="wikia-article-list">
                    {theme.articles.map((art) => (
                      <li key={art.titre}>
                        <Link to={art.slug} className="wikia-article-link">
                          <span className="wikia-article-emoji" aria-hidden="true">
                            {art.emoji}
                          </span>
                          <span>{art.titre}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {theme.ressources?.length > 0 && (
                    <>
                      <div className="wikia-theme-col-label" style={{ marginTop: 24 }}>
                        Ressources
                      </div>
                      <ul className="wikia-ressource-list">
                        {theme.ressources.map((r) => (
                          <li key={r.label}>
                            <a
                              href={r.url}
                              className="wikia-ressource-link"
                              target={r.url.startsWith("http") ? "_blank" : undefined}
                              rel={r.url.startsWith("http") ? "noopener noreferrer" : undefined}
                            >
                              <span aria-hidden="true">↗</span> {r.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ASTUCES ── */}
      <section className="wikia-bottom-cta">
        <div className="wikia-bottom-cta-inner">
          <div className="wikia-bottom-cta-kicker">ACADÉMIE · CHALETPEDIA</div>
          <h2 className="wikia-bottom-cta-title">
            Passez à l'action avec nos astuces de PRO
          </h2>
          <p className="wikia-bottom-cta-sub">
            Le wiki vous donne les bases. Nos astuces vous donnent les stratégies
            concrètes pour rentabiliser votre chalet.
          </p>
          <Link to="/academie/astuces/" className="wikia-bottom-cta-btn">
            Voir les astuces →
          </Link>
        </div>
      </section>
    </div>
  );
}

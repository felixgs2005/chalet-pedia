// src/pages/Blogue.jsx
// ============================================================
// PAGE BLOGUE — DYNAMIQUE
// La liste, l'article à la une et les filtres sont générés à
// partir de src/data/articles.js. Pour ajouter un article,
// modifiez uniquement ce fichier de données.
// ============================================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  filtresBlogue,
  getFeaturedArticle,
  getArticlesNonFeatured,
} from "../data/articles";

export default function Blogue() {
  const [filtreActif, setFiltreActif] = useState("Tous les articles");
  const featured = getFeaturedArticle();

  const articlesAffiches = useMemo(() => {
    const liste = getArticlesNonFeatured();
    if (filtreActif === "Tous les articles") return liste;
    return liste.filter((a) => a.filtre === filtreActif);
  }, [filtreActif]);

  return (
    <div className="blogue-page">
      <section className="blog-hero">
        <div className="blog-hero-kicker">LE JOURNAL · CHALETPEDIA</div>
        <h1 className="blog-hero-title">
          Pour louer mieux,
          <br />
          pour louer plus.
        </h1>
        <p className="blog-hero-sub">
          Conseils, stratégies, études de cas et inspirations pour les propriétaires et locataires
          de chalets au Québec.
        </p>
      </section>

      <div className="blog-filters">
        {filtresBlogue.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltreActif(f)}
            className={`filter-pill${filtreActif === f ? " active" : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtreActif === "Tous les articles" && featured && (
        <div className="featured-section">
          <Link to={`/blogue/${featured.slug}`} className="featured-article">
            <div
              className="featured-img"
              style={{ backgroundImage: `url('${featured.heroImage}')` }}
            />
            <div className="featured-body">
              <div className="featured-badge">{featured.tag}</div>
              <h2 className="featured-title">{featured.titre}</h2>
              <p className="featured-excerpt">{featured.excerpt}</p>
              <div className="featured-meta">
                par <strong>{featured.auteur}</strong> · {featured.dateFull} · {featured.lectureFull}
              </div>
              <div className="featured-cta">Lire l'article →</div>
            </div>
          </Link>
        </div>
      )}

      <div className="articles-section">
        <div className="articles-section-head">
          <h2 className="articles-section-title">
            {filtreActif === "Tous les articles" ? "Tous les articles" : filtreActif}
          </h2>
          <div className="articles-section-count">
            {articlesAffiches.length} article{articlesAffiches.length > 1 ? "s" : ""}
          </div>
        </div>

        {articlesAffiches.length > 0 ? (
          <div className="articles-grid">
            {articlesAffiches.map((a) => (
              <Link key={a.slug} to={`/blogue/${a.slug}`} className="article-card">
                <div className="article-img" style={{ backgroundImage: `url('${a.image}')` }}>
                  <div className={`article-cat-tag${a.partner ? " partner-tag" : ""}`}>{a.tag}</div>
                </div>
                <div className="article-body">
                  <div className="article-title">{a.titre}</div>
                  <p className="article-excerpt">{a.excerpt}</p>
                  <div className="article-meta">
                    <span>{a.date}</span>
                    <span className="article-meta-time">{a.lecture}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="articles-empty">Aucun article dans cette catégorie pour le moment.</p>
        )}

        <div className="newsletter-cta">
          <h3>Recevez nos meilleurs articles</h3>
          <p>
            Une fois par mois, conseils, études de cas et inspirations pour louer mieux et louer
            plus. Pas de spam, désinscription en un clic.
          </p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="votre@email.com" required />
            <button type="submit">S'abonner →</button>
          </form>
        </div>
      </div>
    </div>
  );
}

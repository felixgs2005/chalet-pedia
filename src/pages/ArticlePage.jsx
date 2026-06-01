// src/pages/ArticlePage.jsx
// ============================================================
// PAGE ARTICLE DYNAMIQUE
// Créée une seule fois, elle s'adapte au slug de l'URL
// (/blogue/:slug) à partir de src/data/articles.js.
// ============================================================

import { useParams, Link } from "react-router-dom";
import { getArticleBySlug, getRelatedArticles } from "../data/articles";

export default function ArticlePage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR 404</div>
        <h1 className="section-title" style={{ fontSize: 48, marginTop: 12, marginBottom: 20 }}>
          Article introuvable
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>
          Cet article n'existe pas ou a été retiré.
        </p>
        <Link to="/blogue/" className="btn-annoncer">← Retour au blogue</Link>
      </div>
    );
  }

  const similaires = getRelatedArticles(article.slug, 2);

  return (
    <div className="article-page">
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">›</span>
        <Link to="/blogue/">Le Journal</Link>
        <span className="separator">›</span>
        <span style={{ color: "#1A1A1A" }}>{article.breadcrumb}</span>
      </nav>

      <header className="article-header">
        <div className={article.badgeType === "partner" ? "partner-badge" : "article-cat-badge"}>
          {article.badge}
        </div>
        <h1 className="article-h1">{article.titre}</h1>
        <div className="article-meta">
          <div className="article-meta-author">
            <div className="article-meta-author-avatar">{article.auteurInitiales}</div>
            <span>par {article.auteur}</span>
          </div>
          <span className="article-meta-dot">•</span>
          <span>{article.dateFull}</span>
          <span className="article-meta-dot">•</span>
          <span>{article.lectureFull}</span>
        </div>
      </header>

      <div className="article-hero-img">
        <img src={article.heroImage} alt={article.heroAlt} />
        {article.heroCaption && (
          <div className="article-hero-caption">{article.heroCaption}</div>
        )}
      </div>

      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: article.contenuHtml }}
      />

      {similaires.length > 0 && (
        <section className="related">
          <h2 className="related-title">À lire aussi.</h2>
          <div className="related-grid">
            {similaires.map((a) => (
              <Link key={a.id} to={`/blogue/${a.slug}`} className="related-card">
                <div className="related-img" style={{ backgroundImage: `url('${a.image}')` }} />
                <div className="related-body">
                  <div className="related-cat">{a.categorie}</div>
                  <div className="related-name">{a.titre}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

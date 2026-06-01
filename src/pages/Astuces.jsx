// src/pages/Astuces.jsx
import { Link } from "react-router-dom";
import { getAstucesArticles, citqSteps } from "../data/astuces";

function formatTags(tags) {
  return tags
    .map((t) => (t.emoji ? `${t.label} ${t.emoji}` : t.label))
    .join(" · ");
}

export default function Astuces() {
  const articles = getAstucesArticles();

  return (
    <div className="astuces-page">
      <section className="astuces-hero">
        <div className="astuces-hero-kicker">ACADÉMIE · CHALETPEDIA</div>
        <h1 className="astuces-hero-title">Astuces &amp; Conseils</h1>
        <p className="astuces-hero-sub">
          Voici toutes nos astuces et conseils d'experts visant à aider les propriétaires de chalets
          locatifs à rentabiliser leur investissement, maximiser leurs bénéfices et augmenter leur
          visibilité.
        </p>
      </section>

      <section className="astuces-pro-section">
        <div className="astuces-pro-inner">
          <h2 className="astuces-pro-title">Trucs de PRO 🏆</h2>

          {articles.length > 0 ? (
            <div className="articles-grid astuces-grid">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  to={`/academie/astuces/${a.slug}`}
                  className="article-card astuce-card"
                >
                  <div className="article-img" style={{ backgroundImage: `url('${a.image}')` }}>
                    <div className="article-cat-tag astuce-card-tag">
                      {formatTags(a.astuceTags)}
                    </div>
                  </div>
                  <div className="article-body">
                    <h3 className="article-title">{a.titre}</h3>
                    <div className="astuce-card-meta">
                      <span>{a.dateFull}</span>
                      <span>
                        par <strong>{a.auteur}</strong>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="articles-empty">Aucune astuce publiée pour le moment.</p>
          )}
        </div>
      </section>

      <section className="astuces-formations-cta">
        <p>
          Vous maîtrisez ces astuces à la perfection et souhaitez passer au niveau supérieur ?{" "}
          <Link to="/academie/formations/">Découvrez nos formations.</Link>
        </p>
      </section>

      <section className="astuces-citq">
        <div className="astuces-citq-inner">
          <h2 className="astuces-citq-title">
            <span aria-hidden="true">🏡</span> Devenir hôte légal au Québec en 5 étapes
          </h2>
          <ol className="astuces-citq-steps">
            {citqSteps.map((step) => (
              <li key={step.num} className="astuces-citq-step">
                <span className="astuces-citq-step-icon" aria-hidden="true">
                  {step.icon}
                </span>
                <div>
                  <strong>
                    {step.num}. {step.title}
                  </strong>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="astuces-citq-caption">
            Infographie préparée par ChaletPedia · Le Québec en mode chalet
          </p>
        </div>
      </section>
    </div>
  );
}

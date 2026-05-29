// src/pages/Blogue.jsx
// Page Blogue — statique pour l'instant (contenu repris de la maquette).

const filtres = [
  "Tous les articles",
  "Photographie",
  "SEO & visibilité",
  "Avis clients",
  "Décoration",
  "Tarification",
];

const articlesBlogue = [
  {
    img: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&q=85&auto=format&fit=crop",
    cat: "PHOTOGRAPHIE · 8 MIN LECTURE",
    titre: "Pourquoi les photos professionnelles sont essentielles pour un chalet",
    excerpt:
      "Les annonces avec photos professionnelles génèrent 60 % de réservations supplémentaires. Voici pourquoi — et comment investir intelligemment dans votre image.",
    date: "9 janvier 2026 · par ChaletPedia",
  },
  {
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop",
    cat: "STRATÉGIE SEO · 10 MIN LECTURE",
    titre: "Pourquoi la visibilité est la clé pour un chalet rentable",
    excerpt:
      "Un chalet bien décoré ne suffit pas. Sans visibilité Google et plateformes, il reste invisible. Le levier SEO local expliqué simplement.",
    date: "9 janvier 2026 · par ChaletPedia",
  },
];

export default function Blogue() {
  return (
    <div className="blogue-page">
      <section className="blogue-hero">
        <div className="blogue-kicker">LE JOURNAL · CHALETPEDIA</div>
        <h1 className="blogue-title">
          Pour louer mieux,
          <br />
          pour louer plus.
        </h1>
        <p className="blogue-sub">
          Conseils, stratégies et études de cas pour transformer votre chalet en machine à
          réservations.
        </p>
      </section>

      <div className="blogue-filters">
        {filtres.map((f, i) => (
          <a
            key={f}
            href="#"
            onClick={(e) => e.preventDefault()}
            className={`filter-chip${i === 0 ? " active" : ""}`}
          >
            {f}
          </a>
        ))}
      </div>

      <div className="articles-section">
        <div className="articles-grid">
          {articlesBlogue.map((a) => (
            <a
              key={a.titre}
              href="#"
              onClick={(e) => e.preventDefault()}
              className="article-card"
            >
              <div
                className="article-img"
                style={{ backgroundImage: `url('${a.img}')` }}
              />
              <div className="article-body">
                <div className="article-cat">{a.cat}</div>
                <div className="article-title">{a.titre}</div>
                <div className="article-excerpt">{a.excerpt}</div>
                <div className="article-date">{a.date}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="load-more">
          <button className="load-more-btn">
            Voir plus d'articles <span>↓</span>
          </button>
          <div className="load-more-note">
            D'autres articles sont en préparation. Abonnez-vous à l'infolettre pour ne rien
            manquer.
          </div>
        </div>
      </div>

      <section className="newsletter">
        <div className="newsletter-kicker">INFOLETTRE · CHALETPEDIA</div>
        <h2 className="newsletter-title">
          Recevez nos conseils,
          <br />
          directement dans votre boîte.
        </h2>
        <p className="newsletter-sub">
          Un courriel par mois, sans spam. Astuces de propriétaires, études de cas, tendances du
          marché.
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="votre@courriel.com" required />
          <button type="submit">S'abonner</button>
        </form>
      </section>
    </div>
  );
}

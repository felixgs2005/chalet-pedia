// src/pages/Entretien.jsx
// Page catégorie "Entretien" — reproduit chaletpedia.com/chalets/entretien/
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryListings } from "../data/services";

const CATEGORIE = "Entretien";
const CATEGORIE_SLUG = "entretien";
const DESCRIPTION = "Ménage, entretien du terrain, piscine, spa et déneigement.";
const HERO_IMAGE = "/images/services/entretien.webp";

const annonces = getCategoryListings(CATEGORIE_SLUG);

export default function Entretien() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  const filtered = useMemo(() => {
    const list = annonces.filter((a) => {
      if (searchQuery.trim() === "") return true;
      const q = searchQuery.toLowerCase();
      return (
        a.titre.toLowerCase().includes(q) ||
        a.localisation.toLowerCase().includes(q)
      );
    });
    if (sortOption === "title") {
      return [...list].sort((a, b) => a.titre.localeCompare(b.titre));
    }
    return list;
  }, [searchQuery, sortOption]);

  const count = filtered.length;

  return (
    <div className="services-page">
      <section
        className="header-hero listing-hero services-hero services-hero--photo"
        style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
      >
        <span className="services-hero__scrim" aria-hidden="true" />
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="services-hero__kicker services-reveal">
                Services de chalet · Québec
              </div>
              <h1 className="hp-listing-category__name services-reveal services-reveal--d1">
                {CATEGORIE}
              </h1>
              <p className="hp-listing-category__description services-reveal services-reveal--d2">
                {DESCRIPTION}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="services-content">
        <form
          className="services-search-wrap services-reveal services-reveal--d2"
          onSubmit={(e) => e.preventDefault()}
          role="search"
          aria-label="Recherche dans Entretien"
        >
          <div className="search-bar services-search-bar services-search-bar--solo">
            <div className="search-field" style={{ borderRight: "none" }}>
              <div className="label">Rechercher dans Entretien</div>
              <input
                type="search"
                placeholder="Nom de l'entreprise, ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">
              Rechercher
            </button>
          </div>
        </form>

        <div className="listing-topbar services-reveal services-reveal--d2" style={{ marginBottom: 24 }}>
          <div className="results-count">
            Affichage de 1-{count} résultat{count > 1 ? "s" : ""} sur {annonces.length}
          </div>
          <div className="sort-by">
            <span>Trier par</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="date">Date d'ajout</option>
              <option value="title">Titre (A-Z)</option>
            </select>
          </div>
        </div>

        {count === 0 ? (
          <div className="services-empty">
            <h3>Aucun résultat</h3>
            <p>Aucune annonce ne correspond à votre recherche.</p>
            <button
              type="button"
              className="services-empty__link services-empty__link--btn"
              onClick={() => setSearchQuery("")}
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <div className="service-listings-grid">
            {filtered.map((a, i) => (
              <Link
                key={a.slug}
                to={`/chalets/${CATEGORIE_SLUG}/${a.slug}`}
                className="service-listing-card service-listing-card--link"
                style={{ "--card-index": i }}
              >
                <div
                  className="service-listing-card__img"
                  style={{ backgroundImage: `url('${a.image}')` }}
                >
                  <span className="service-listing-card__badge">{CATEGORIE}</span>
                </div>
                <div className="service-listing-card__body">
                  <h2 className="service-listing-card__title">{a.titre}</h2>
                  <div className="service-listing-card__loc">{a.localisation}</div>
                  <div className="service-listing-card__date">Ajouté le {a.date}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

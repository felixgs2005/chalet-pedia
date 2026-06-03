import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useServiceCategory } from "../hooks/useServiceCategory";
import { getServicePrimaryImage } from "../utils/serviceImages";

/**
 * Liste des annonces d'une catégorie (Construction, Décoration, etc.)
 * Données : Firestore categorieServices / annoncesService
 */
export default function ServiceCategoryListPage({ categorySlug, fallbackHero }) {
  const { category, listings: annonces, loading, error } = useServiceCategory(categorySlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("date");

  const categorieNom = category?.nom ?? categorySlug;
  const description = category?.description ?? "";
  const heroImage = category?.image || fallbackHero;

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
  }, [annonces, searchQuery, sortOption]);

  const count = filtered.length;

  if (loading) {
    return (
      <div className="services-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">SERVICES</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement des annonces…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger les annonces
        </h1>
        <p style={{ color: "#4A4A48" }}>{error.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <section
        className="header-hero listing-hero services-hero services-hero--photo"
        style={{ backgroundImage: `url('${heroImage}')` }}
      >
        <span className="services-hero__scrim" aria-hidden="true" />
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="services-hero__kicker services-reveal">
                Services de chalet · Québec
              </div>
              <h1 className="hp-listing-category__name services-reveal services-reveal--d1">
                {categorieNom}
              </h1>
              <p className="hp-listing-category__description services-reveal services-reveal--d2">
                {description}
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
          aria-label={`Recherche dans ${categorieNom}`}
        >
          <div className="search-bar services-search-bar services-search-bar--solo">
            <div className="search-field" style={{ borderRight: "none" }}>
              <div className="label">Rechercher dans {categorieNom}</div>
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
            Affichage de {count > 0 ? `1-${count}` : "0"} résultat{count > 1 ? "s" : ""} sur{" "}
            {annonces.length}
          </div>
          <div className="sort-by">
            <span>Trier par</span>
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="date">Date d&apos;ajout</option>
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
                to={`/chalets/${categorySlug}/${a.slug}`}
                className="service-listing-card service-listing-card--link"
                style={{ "--card-index": i }}
              >
                <div className="service-listing-card__media">
                  <div className="service-listing-card__img">
                    <img
                      className="service-listing-card__img-photo"
                      src={getServicePrimaryImage(a)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                    <span className="service-listing-card__shine" aria-hidden="true" />
                    <span className="service-listing-card__badge">{categorieNom}</span>
                  </div>
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

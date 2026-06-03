// src/pages/AccueilServices.jsx
// Données chargées depuis Firestore (categorieServices + annoncesService).
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  categorySelectGroups,
  getTotalAnnonces,
  pluralizeAnnonce,
} from "../data/services";
import { useServiceCategories } from "../hooks/useServiceCategories";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export default function AccueilServices() {
  const { categories: serviceCategories, loading, error } = useServiceCategories();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [ctaRef, ctaVisible] = useReveal();

  const serviceCategorySlugs = useMemo(
    () => new Set(serviceCategories.map((c) => c.slug)),
    [serviceCategories]
  );

  const filteredCategories = useMemo(() => {
    return serviceCategories.filter((cat) => {
      if (selectedCategory !== "all" && selectedCategory !== "services") {
        if (serviceCategorySlugs.has(selectedCategory)) {
          if (cat.slug !== selectedCategory) return false;
        } else {
          return false;
        }
      }

      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesName = cat.nom.toLowerCase().includes(query);
        const matchesDesc = cat.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, serviceCategories, serviceCategorySlugs]);

  const totalAnnonces = getTotalAnnonces(serviceCategories);
  const visibleAnnonces = getTotalAnnonces(filteredCategories);
  const isFiltering = selectedCategory !== "all" || searchQuery.trim() !== "";
  const isNonServiceCategory =
    selectedCategory !== "all" &&
    selectedCategory !== "services" &&
    !serviceCategorySlugs.has(selectedCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const resetSearch = () => {
    setSelectedCategory("all");
    setSearchQuery("");
  };

  if (loading) {
    return (
      <div className="services-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">SERVICES</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement des catégories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger les services
        </h1>
        <p style={{ color: "#4A4A48" }}>{error.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  return (
    <div className="services-page">
      <section className="header-hero listing-hero services-hero">
        <span className="services-hero__glow" aria-hidden="true" />
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="hp-listing-category__item-count services-reveal">
                {totalAnnonces} {pluralizeAnnonce(totalAnnonces)}
              </div>
              <h1 className="hp-listing-category__name services-reveal services-reveal--d1">
                Services de chalet au Québec
              </h1>
              <p className="hp-listing-category__description services-reveal services-reveal--d2">
                Découvrez nos services de chalet au Québec : constructeurs, décorations,
                nettoyage, et plus pour vos chalets à louer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="services-content">
        <form
          className="services-search-wrap services-reveal services-reveal--d2"
          onSubmit={handleSubmit}
          role="search"
          aria-label="Recherche de services"
        >
          <div className="search-bar services-search-bar">
            <div className="search-field">
              <div className="label">Catégorie</div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                aria-label="Toutes les catégories"
              >
                <option value="all">Toutes les catégories</option>
                {categorySelectGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div className="search-field" style={{ borderRight: "none" }}>
              <div className="label">Rechercher</div>
              <input
                type="search"
                placeholder="Mot-clé, service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">
              Rechercher
            </button>
          </div>
        </form>

        {isNonServiceCategory ? (
          <div className="services-empty">
            <h3>Aucune catégorie de service pour cette sélection</h3>
            <p>
              Cette catégorie correspond aux chalets à louer ou à vendre. Consultez notre
              répertoire d&apos;annonces pour explorer les offres disponibles.
            </p>
            <Link to="/chalets/chalet-a-louer/" className="services-empty__link">
              Voir les chalets à louer →
            </Link>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="services-empty">
            <h3>Aucun service trouvé</h3>
            <p>Essayez un autre mot-clé ou sélectionnez « Toutes les catégories ».</p>
            <button
              type="button"
              className="services-empty__link services-empty__link--btn"
              onClick={resetSearch}
            >
              Réinitialiser la recherche
            </button>
          </div>
        ) : (
          <>
            {isFiltering ? (
              <p className="services-results-count">
                {visibleAnnonces} {pluralizeAnnonce(visibleAnnonces)} dans{" "}
                {filteredCategories.length} catégorie
                {filteredCategories.length > 1 ? "s" : ""}
              </p>
            ) : null}

            <div className="services-categories-grid" key={selectedCategory}>
              {filteredCategories.map((cat, i) => (
                <Link
                  key={cat.slug}
                  to={cat.href || `/chalets/${cat.slug}/`}
                  className="services-category-card"
                  style={{ "--card-index": i }}
                >
                  <div className="services-category-card__media">
                    <div
                      className="services-category-card__img"
                      style={{ backgroundImage: `url('${cat.image}')` }}
                    />
                    <span className="services-category-card__count">
                      {cat.annonceCount} {pluralizeAnnonce(cat.annonceCount)}
                    </span>
                  </div>
                  <div className="services-category-card__body">
                    {cat.tagline ? (
                      <div className="services-category-card__tag">{cat.tagline}</div>
                    ) : null}
                    <h2 className="services-category-card__title">{cat.nom}</h2>
                    <p className="services-category-card__desc">{cat.description}</p>
                    <span className="services-category-card__link">
                      Voir les annonces
                      <span className="services-category-card__arrow" aria-hidden="true">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <section
          ref={ctaRef}
          className={`services-cta${ctaVisible ? " is-visible" : ""}`}
        >
          <div className="services-cta__inner">
            <div className="services-cta__kicker">Vous offrez un service ?</div>
            <h2 className="services-cta__title">
              Inscrivez votre entreprise dans le répertoire
            </h2>
            <p className="services-cta__sub">
              Rejoignez le plus grand répertoire de services pour chalets au Québec et
              gagnez en visibilité auprès des propriétaires.
            </p>
            <Link
              to="/inscrivez-votre-entreprise-dans-le-repertoire/"
              className="services-cta__btn"
            >
              Inscrire mes services →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

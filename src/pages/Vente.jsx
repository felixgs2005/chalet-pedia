// src/pages/Vente.jsx
// ============================================================
// PAGE CHALETS À VENDRE — LISTE (DYNAMIQUE) + FILTRES
// Données chargées depuis Firestore (collection ventes).
// ============================================================

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useVentes } from "../hooks/useVentes";
import { PinIcon, BedIcon, BathIcon, GarageIcon } from "../components/Icons";

const prixToNumber = (prix) => Number(String(prix).replace(/[^\d]/g, "")) || 0;

export default function Vente() {
  const { ventes, loading, error } = useVentes();
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sallesDeBain, setSallesDeBain] = useState("");
  const [sortOption, setSortOption] = useState("recent");

  const regionsDispo = useMemo(
    () => Array.from(new Set(ventes.map((v) => v.region).filter(Boolean))),
    [ventes]
  );

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setRegion("all");
    setMinPrice("");
    setMaxPrice("");
    setSallesDeBain("");
    setSortOption("recent");
  };

  const hasActiveFilters =
    searchQuery || locationQuery || region !== "all" || minPrice || maxPrice || sallesDeBain;

  const filteredVentes = useMemo(() => {
    return ventes
      .filter((v) => {
        if (region !== "all" && v.region !== region) return false;

        if (searchQuery.trim() !== "") {
          const q = searchQuery.toLowerCase();
          const matches =
            v.nom?.toLowerCase().includes(q) ||
            v.titre?.toLowerCase().includes(q) ||
            v.localisation?.toLowerCase().includes(q) ||
            v.descriptionHtml?.toLowerCase().includes(q);
          if (!matches) return false;
        }

        if (locationQuery.trim() !== "") {
          const loc = locationQuery.toLowerCase();
          if (!v.localisation?.toLowerCase().includes(loc)) return false;
        }

        const prix = prixToNumber(v.prix);
        if (minPrice && prix < parseFloat(minPrice)) return false;
        if (maxPrice && prix > parseFloat(maxPrice)) return false;

        if (sallesDeBain && v.sdb < parseInt(sallesDeBain, 10)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "title") return a.nom.localeCompare(b.nom);
        if (sortOption === "price_asc") return prixToNumber(a.prix) - prixToNumber(b.prix);
        if (sortOption === "price_desc") return prixToNumber(b.prix) - prixToNumber(a.prix);
        return 0;
      });
  }, [ventes, searchQuery, locationQuery, region, minPrice, maxPrice, sallesDeBain, sortOption]);

  if (loading) {
    return (
      <div className="vente-page listing-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">CHALETS À VENDRE</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement des annonces…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vente-page listing-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger les annonces
        </h1>
        <p style={{ color: "#4A4A48" }}>{error.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  return (
    <div className="vente-page listing-page">
      <section className="header-hero listing-hero">
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="hp-listing-category__item-count">
                {ventes.length} annonce{ventes.length !== 1 ? "s" : ""}
              </div>
              <h1 className="hp-listing-category__name">Chalets à vendre</h1>
              <p className="hp-listing-category__description">
                Propriétés exceptionnelles à travers les régions du Québec, vendues directement par
                leurs propriétaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="site-content" style={{ padding: "0 36px 52px" }}>
        <div
          className="listing-search-wrap"
          style={{ margin: "-24px auto 32px", position: "relative", zIndex: 10 }}
        >
          <div className="search-bar">
            <div className="search-field">
              <div className="label">Rechercher</div>
              <input
                type="text"
                placeholder="Ville, région ou mot-clé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="search-field" style={{ borderRight: "none" }}>
              <div className="label">Localisation</div>
              <input
                type="text"
                placeholder="Où cherchez-vous ?"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
              />
            </div>
            <button type="button" className="search-btn">
              ⌕ Filtrer
            </button>
          </div>
        </div>

        {/* DEUX COLONNES : FILTRES + RÉSULTATS */}
        <div className="listing-main-grid">
          <aside className="listing-sidebar">
            <div className="filter-widget">
              <div className="filter-widget-header">
                <h3>Filtres de recherche</h3>
                {hasActiveFilters && (
                  <button onClick={handleResetFilters} className="btn-reset-filters">
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Région / catégorie */}
              <div className="filter-section">
                <label className="filter-label">Région du Québec</label>
                <div className="category-radios">
                  <label className="radio-container">
                    <input
                      type="radio"
                      name="region"
                      value="all"
                      checked={region === "all"}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                    <span>Toutes les régions</span>
                  </label>
                  {regionsDispo.map((r) => (
                    <label key={r} className="radio-container">
                      <input
                        type="radio"
                        name="region"
                        value={r}
                        checked={region === r}
                        onChange={(e) => setRegion(e.target.value)}
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix demandé */}
              <div className="filter-section">
                <label className="filter-label">Prix demandé ($)</label>
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="price-sep">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Salles de bain */}
              <div className="filter-section">
                <label className="filter-label">Salles de bain</label>
                <select value={sallesDeBain} onChange={(e) => setSallesDeBain(e.target.value)}>
                  <option value="">Nombre de salles de bain</option>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}+ salle{num > 1 ? "s" : ""} de bain
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          {/* RÉSULTATS */}
          <div className="listing-content-area">
            <div className="listing-topbar">
              <div className="results-count">
                Affichage de {filteredVentes.length} résultat{filteredVentes.length !== 1 ? "s" : ""}{" "}
                sur {ventes.length}
              </div>
              <div className="sort-by">
                <span>Trier par</span>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="recent">Plus récents</option>
                  <option value="title">Titre (A-Z)</option>
                  <option value="price_asc">Prix demandé ↑</option>
                  <option value="price_desc">Prix demandé ↓</option>
                </select>
              </div>
            </div>

            {filteredVentes.length > 0 ? (
              <div className="listings-grid">
                {filteredVentes.map((v) => (
                  <Link
                    key={v.slug}
                    to={`/chalets/chalets-a-vendre/${v.slug}`}
                    className="listing-card"
                  >
                    <div
                      className="listing-img"
                      style={{ backgroundImage: `url('${v.cardImage}')` }}
                    >
                      <div className="listing-badge">{v.regionBadge}</div>
                    </div>
                    <div className="listing-body">
                      <div className="listing-name">{v.nom}</div>
                      <div className="listing-location">
                        <PinIcon /> {v.localisation}
                      </div>
                      <div className="listing-features">
                        <span>
                          <BedIcon /> {v.chambres} chambres
                        </span>
                        <span>
                          <BathIcon /> {v.sdb} SDB
                        </span>
                        <span>
                          <GarageIcon /> {v.garages} garages
                        </span>
                      </div>
                      <div className="listing-footer">
                        <div>
                          <span className="listing-price-label">Prix demandé</span>
                          <span className="listing-price">{v.prix}</span>
                        </div>
                        <span className="listing-cta">Visiter →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>Aucun chalet trouvé</h3>
                <p>Essayez de modifier ou de réinitialiser vos filtres de recherche.</p>
                <button
                  onClick={handleResetFilters}
                  className="booking-secondary"
                  style={{ width: "auto", padding: "10px 24px" }}
                >
                  Réinitialiser tous les filtres
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

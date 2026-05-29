// src/pages/ALouer.jsx
import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { chalets } from "../data/chalets";
import ChaletCard from "../components/ChaletCard";

export default function ALouer() {
  const { regionSlug } = useParams();
  const navigate = useNavigate();

  const getCategoryFromSlug = (slug) => {
    if (!slug) return "all";
    if (slug === "saguenay-lac-saint-jean") return "saguenay";
    if (slug === "chaudiere-appalaches") return "appalaches";
    return slug;
  };

  const getSlugFromCategory = (cat) => {
    if (cat === "all") return "";
    if (cat === "saguenay") return "saguenay-lac-saint-jean";
    if (cat === "appalaches") return "chaudiere-appalaches";
    return cat;
  };

  // --- États pour les filtres ---
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [category, setCategory] = useState(() => getCategoryFromSlug(regionSlug));
  
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  const [invites, setInvites] = useState("");
  const [chambres, setChambres] = useState("");
  const [sallesDeBain, setSallesDeBain] = useState("");

  const [rabaisOnly, setRabaisOnly] = useState(false);

  // Caractéristiques (cases à cocher)
  const [features, setFeatures] = useState({
    animaux: false,
    bordEau: false,
    boise: false,
    poker: false,
    billard: false,
    spa: false,
    foyer: false,
    handicape: false,
    couples: false,
  });

  const [sortOption, setSortOption] = useState("date");

  // Fonction pour basculer les cases des caractéristiques
  const handleFeatureChange = (name) => {
    setFeatures((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    setCategory(getCategoryFromSlug(regionSlug));
    
    // Mettre à jour le titre du document pour le SEO
    let title = "Chalets à louer au Québec | Chaletpedia";
    if (regionSlug === "laurentides") title = "Chalets à Louer dans les Laurentides | Nature, Spa et Lac";
    else if (regionSlug === "gaspesie") title = "Chalets à louer en Gaspésie | Chaletpedia";
    else if (regionSlug === "saguenay-lac-saint-jean") title = "Chalets à louer au Saguenay-Lac-Saint-Jean | Chaletpedia";
    else if (regionSlug === "chaudiere-appalaches") title = "Chalets à louer dans la Chaudière-Appalaches | Chaletpedia";
    document.title = title;
  }, [regionSlug]);

  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    navigate("/chalets/chalet-a-louer/");
    setMinPrice("");
    setMaxPrice("");
    setInvites("");
    setChambres("");
    setSallesDeBain("");
    setRabaisOnly(false);
    setFeatures({
      animaux: false,
      bordEau: false,
      boise: false,
      poker: false,
      billard: false,
      spa: false,
      foyer: false,
      handicape: false,
      couples: false,
    });
    setSortOption("date");
  };

  // --- Logique de filtrage et de tri ---
  const filteredChalets = useMemo(() => {
    return chalets
      .filter((chalet) => {
        // Filtre par catégorie / région
        if (category !== "all") {
          const catLower = category.toLowerCase();
          const regionLower = chalet.regionLabel?.toLowerCase() || "";
          const regionFullLower = chalet.region?.toLowerCase() || "";
          if (!regionLower.includes(catLower) && !regionFullLower.includes(catLower)) {
            return false;
          }
        }

        // Recherche textuelle (correspond au nom du chalet, sous-titre, description, CITQ)
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchesName = chalet.nom?.toLowerCase().includes(query);
          const matchesSub = chalet.sousTitre?.toLowerCase().includes(query);
          const matchesDesc = chalet.description?.toLowerCase().includes(query);
          const matchesCitq = chalet.citq?.toLowerCase().includes(query);
          if (!matchesName && !matchesSub && !matchesDesc && !matchesCitq) {
            return false;
          }
        }

        // Recherche de localisation
        if (locationQuery.trim() !== "") {
          const loc = locationQuery.toLowerCase();
          if (!chalet.localisation?.toLowerCase().includes(loc)) {
            return false;
          }
        }

        // Plage de prix
        const price = chalet.prixNuit;
        if (price !== null && price !== undefined) {
          if (minPrice && price < parseFloat(minPrice)) return false;
          if (maxPrice && price > parseFloat(maxPrice)) return false;
        } else {
          // Si le prix est nul (prix sur demande) et que le prix min ou max est défini, on l'exclut
          if (minPrice || maxPrice) return false;
        }

        // Capacité d'accueil
        if (invites && chalet.invites < parseInt(invites, 10)) {
          return false;
        }

        // Chambres
        if (chambres && chalet.chambres < parseInt(chambres, 10)) {
          return false;
        }

        // Salles de bain
        if (sallesDeBain && chalet.sdb < parseInt(sallesDeBain, 10)) {
          return false;
        }

        // Rabais (Simulation : comme nous n'avons pas de champ rabais, traitons favoris ou bas prix comme rabais)
        if (rabaisOnly && chalet.prixNuit > 200) {
          return false;
        }

        // Correspondance des caractéristiques (cases à cocher)
        const chaletFeatures = chalet.caracteristiques || [];
        const hasFeature = (keywords) => {
          return chaletFeatures.some((f) =>
            keywords.some((kw) => f.toLowerCase().includes(kw))
          );
        };

        if (features.animaux && !hasFeature(["animaux", "pet"])) return false;
        if (features.bordEau && !hasFeature(["eau", "mer", "lac", "fjord", "plage"])) return false;
        if (features.boise && !hasFeature(["boisé", "nature", "forêt"])) return false;
        if (features.poker && !hasFeature(["poker"])) return false;
        if (features.billard && !hasFeature(["billard"])) return false;
        if (features.spa && !hasFeature(["spa", "sauna"])) return false;
        if (features.foyer && !hasFeature(["foyer"])) return false;
        if (features.handicape && !hasFeature(["handicap", "accessible"])) return false;
        if (features.couples && !hasFeature(["romantique", "couple"])) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "title") {
          return a.nom.localeCompare(b.nom);
        }
        if (sortOption === "price_asc") {
          const pA = a.prixNuit ?? 999999;
          const pB = b.prixNuit ?? 999999;
          return pA - pB;
        }
        if (sortOption === "price_desc") {
          const pA = a.prixNuit ?? -1;
          const pB = b.prixNuit ?? -1;
          return pB - pA;
        }
        // Par défaut : Trier par date d'ajout (analysée ou repli vers l'index)
        const parseDate = (dStr) => {
          if (!dStr) return 0;
          // Exemple : "décembre 27, 2025" ou "mai 11, 2025"
          const months = {
            janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
            juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11
          };
          const parts = dStr.toLowerCase().replace(",", "").split(" ");
          if (parts.length === 3) {
            const m = months[parts[0]] ?? 0;
            const d = parseInt(parts[1], 10) || 1;
            const y = parseInt(parts[2], 10) || 2024;
            return new Date(y, m, d).getTime();
          }
          return 0;
        };
        return parseDate(b.dateAjout) - parseDate(a.dateAjout);
      });
  }, [
    category,
    searchQuery,
    locationQuery,
    minPrice,
    maxPrice,
    invites,
    chambres,
    sallesDeBain,
    rabaisOnly,
    features,
    sortOption,
  ]);

  return (
    <div className="listing-page">
      {/* FIL D'ARIANE */}
      <nav className="breadcrumb" style={{ background: "#fff", padding: "18px 36px 0" }}>
        <Link to="/">Accueil</Link>
        <span className="separator"> / </span>
        {category === "all" ? (
          <span style={{ color: "#1A1A1A" }}>Chalets à louer</span>
        ) : (
          <>
            <Link to="/chalets/chalet-a-louer/">Chalets à louer</Link>
            <span className="separator"> / </span>
            <span style={{ color: "#1A1A1A" }}>
              {category === "laurentides" && "Laurentides"}
              {category === "gaspesie" && "Gaspésie"}
              {category === "saguenay" && "Saguenay-Lac-Saint-Jean"}
              {category === "appalaches" && "Chaudière-Appalaches"}
            </span>
          </>
        )}
      </nav>

      {/* EN-TÊTE HÉROS */}
      <section className="header-hero listing-hero">
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="hp-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div className="hp-listing-category__item-count">{filteredChalets.length} annonce{filteredChalets.length !== 1 ? "s" : ""}</div>
                  <h1 className="hp-listing-category__name">
                    {category === "all" && "Chalets à louer"}
                    {category === "laurentides" && "Chalets à louer dans les Laurentides"}
                    {category === "gaspesie" && "Chalets à louer en Gaspésie"}
                    {category === "saguenay" && "Chalets à louer au Saguenay-Lac-Saint-Jean"}
                    {category === "appalaches" && "Chalets à louer dans la Chaudière-Appalaches"}
                  </h1>
                  <p className="hp-listing-category__description">
                    {category === "all" && "Découvrez les plus beaux chalets à louer au Québec parmi une grande sélection."}
                    {category === "laurentides" && (
                      <>
                        La région des Laurentides est l'une des plus prisées pour la location de chalets au Québec. Située entre montagnes, lacs et forêts, elle offre une multitude d'activités en toute saison. Parcourez nos annonces de <strong>chalets avec spa</strong>, <strong>chalets au bord de l'eau</strong> ou encore de <strong>chalet A-Frame</strong> en pleine nature.
                      </>
                    )}
                    {category === "gaspesie" && "Découvrez les plus beaux chalets à louer en Gaspésie parmi une grande sélection."}
                    {category === "saguenay" && "Découvrez les plus beaux chalets à louer au Saguenay-Lac-Saint-Jean parmi une grande sélection."}
                    {category === "appalaches" && "Découvrez les plus beaux chalets à louer dans la Chaudière-Appalaches parmi une grande sélection."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="site-content" style={{ padding: "0 36px 52px" }}>
        {/* BARRE DE RECHERCHE LARGE */}
        <div className="listing-search-wrap" style={{ margin: "-24px auto 32px", position: "relative", zIndex: 10 }}>
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
            <button className="search-btn">⌕ Filtrer</button>
          </div>
        </div>

        {/* MISE EN PAGE À DEUX COLONNES */}
        <div className="listing-main-grid">
          {/* FILTRES BARRE LATÉRALE */}
          <aside className="listing-sidebar">
            <div className="filter-widget">
              <div className="filter-widget-header">
                <h3>Filtres de recherche</h3>
                {(searchQuery || locationQuery || category !== "all" || minPrice || maxPrice || invites || chambres || sallesDeBain || rabaisOnly || Object.values(features).some(Boolean)) && (
                  <button onClick={handleResetFilters} className="btn-reset-filters">
                    Réinitialiser
                  </button>
                )}
              </div>

              {/* Sélecteur de catégorie */}
              <div className="filter-section">
                <label className="filter-label">Région du Québec</label>
                <div className="category-radios">
                  {[
                    { val: "all", label: "Toutes les régions" },
                    { val: "laurentides", label: "Laurentides" },
                    { val: "gaspesie", label: "Gaspésie" },
                    { val: "saguenay", label: "Saguenay-Lac-Saint-Jean" },
                    { val: "appalaches", label: "Chaudière-Appalaches" },
                  ].map((cat) => (
                    <label key={cat.val} className="radio-container">
                      <input
                        type="radio"
                        name="category"
                        value={cat.val}
                        checked={category === cat.val}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setCategory(newCat);
                          const slug = getSlugFromCategory(newCat);
                          if (slug) {
                            navigate(`/chalets/chalets-a-louer-${slug}/`);
                          } else {
                            navigate(`/chalets/chalet-a-louer/`);
                          }
                        }}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Plage de prix */}
              <div className="filter-section">
                <label className="filter-label">Prix par nuit ($)</label>
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

              {/* Capacité d'accueil */}
              <div className="filter-section">
                <label className="filter-label">Capacité d'accueil</label>
                <select value={invites} onChange={(e) => setInvites(e.target.value)}>
                  <option value="">Nombre d'invités</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}+ invité{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chambres & Salles de bain */}
              <div className="filter-section price-inputs">
                <div style={{ flex: 1 }}>
                  <label className="filter-label">Chambres</label>
                  <select value={chambres} onChange={(e) => setChambres(e.target.value)}>
                    <option value="">Nbr</option>
                    {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="filter-label">Salles de bain</label>
                  <select value={sallesDeBain} onChange={(e) => setSallesDeBain(e.target.value)}>
                    <option value="">Nbr</option>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>{num}+</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Case Rabais */}
              <div className="filter-section">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={rabaisOnly}
                    onChange={(e) => setRabaisOnly(e.target.checked)}
                  />
                  <span>En rabais uniquement</span>
                </label>
              </div>

              {/* Cases caractéristiques */}
              <div className="filter-section">
                <label className="filter-label">Caractéristiques</label>
                <div className="checkbox-list">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.animaux}
                      onChange={() => handleFeatureChange("animaux")}
                    />
                    <span>Animaux permis 🐾</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.bordEau}
                      onChange={() => handleFeatureChange("bordEau")}
                    />
                    <span>Bord de l'eau 🌊</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.boise}
                      onChange={() => handleFeatureChange("boise")}
                    />
                    <span>Secteur boisé 🌳</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.spa}
                      onChange={() => handleFeatureChange("spa")}
                    />
                    <span>Spa extérieur ♨️</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.foyer}
                      onChange={() => handleFeatureChange("foyer")}
                    />
                    <span>Foyer intérieur/extérieur 🔥</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.poker}
                      onChange={() => handleFeatureChange("poker")}
                    />
                    <span>Table de poker 🃏</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.billard}
                      onChange={() => handleFeatureChange("billard")}
                    />
                    <span>Billard 🎱</span>
                  </label>
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={features.couples}
                      onChange={() => handleFeatureChange("couples")}
                    />
                    <span>Pour les couples 💞</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* CONTENU PRINCIPAL DES ANNONCES */}
          <div className="listing-content-area">
            {/* BARRE SUPÉRIEURE */}
            <div className="listing-topbar">
              <div className="results-count">
                Affichage de 1-{filteredChalets.length} résultats sur {filteredChalets.length}
              </div>
              <div className="sort-by">
                <span>Trier par</span>
                <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                  <option value="date">Date d'ajout</option>
                  <option value="title">Titre (A-Z)</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* GRILLE DES ANNONCES */}
            {filteredChalets.length > 0 ? (
              <div className="chalets-grid">
                {filteredChalets.map((chalet) => (
                  <ChaletCard key={chalet.id} chalet={chalet} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>Aucun chalet trouvé</h3>
                <p>Essayez de modifier ou de réinitialiser vos filtres de recherche.</p>
                <button onClick={handleResetFilters} className="booking-secondary" style={{ width: "auto", padding: "10px 24px" }}>
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

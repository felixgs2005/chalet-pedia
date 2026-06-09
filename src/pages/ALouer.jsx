// src/pages/ALouer.jsx
import { useState, useMemo, useEffect } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useChalets } from "../hooks/useChalets";
import {
  getRegionConfig,
  REGION_NAV_ITEMS,
} from "../data/listingRegions";
import {
  getExperienceConfig,
  EXPERIENCE_NAV_ITEMS,
} from "../data/listingExperiences";
import {
  parseListingPageSlug,
  getPageSlugFromListing,
} from "../data/listingPageSlug";
import {
  chaletHasFeature,
  EMPTY_FEATURES_STATE,
} from "../utils/chaletFeatures";
import ChaletCard from "../components/ChaletCard";

const ACTIVITY_OPTIONS = [
  { key: "peche", label: "Pêche" },
  { key: "ski", label: "Ski" },
];

const TAG_OPTIONS = [
  { key: "luxe", label: "Luxe" },
  { key: "romantique", label: "Romantique" },
  { key: "famille", label: "Famille" },
  { key: "groupe", label: "Groupe" },
  { key: "nature", label: "Nature" },
  { key: "eau", label: "Eau & Lac" },
  { key: "montagne", label: "Montagne" },
  { key: "rustique", label: "Rustique" },
  { key: "scandinave", label: "Scandinave" },
  { key: "couple", label: "Couple" },
  { key: "activités", label: "Activités" },
  { key: "glamping", label: "Glamping" },
  { key: "unique", label: "Unique" },
  { key: "hiver", label: "Hiver" },
  { key: "été", label: "Été" },
  { key: "touristique", label: "Touristique" },
  { key: "vue", label: "Vue" },
  { key: "mer", label: "Mer" },
  { key: "jeux", label: "Jeux" },
];

const SIDEBAR_FEATURE_OPTIONS = [
  { key: "animaux", label: "Animaux permis 🐾" },
  { key: "bordEau", label: "Bord de l'eau 🌊" },
  { key: "boise", label: "Secteur boisé 🌳" },
  { key: "plage", label: "Plage ⛱️" },
  { key: "spa", label: "Spa extérieur ♨️" },
  { key: "foyer", label: "Foyer intérieur/extérieur 🔥" },
  { key: "famille", label: "Famille 👨‍👩‍👧‍👦" },
  { key: "couples", label: "Pour les couples 💞" },
  { key: "poker", label: "Table de poker 🃏" },
  { key: "billard", label: "Billard 🎱" },
];

function featuresFromExperienceKey(experienceKey) {
  const base = { ...EMPTY_FEATURES_STATE };
  const exp = getExperienceConfig(experienceKey);
  if (exp) base[exp.featureKey] = true;
  return base;
}

export default function ALouer() {
  const { chalets, loading, error } = useChalets();
  const { pageSlug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const parsed = parseListingPageSlug(pageSlug);
  const isInvalidSlug = Boolean(pageSlug && !parsed.valid);
  const regionKey = parsed.valid ? parsed.regionKey : "all";
  const experienceKey = parsed.valid ? parsed.experienceKey : null;

  const regionConfig = getRegionConfig(regionKey);
  const experienceConfig = getExperienceConfig(experienceKey);
  const pageConfig = experienceConfig || regionConfig;

  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [regionCategory, setRegionCategory] = useState(regionKey);
  const [experienceCategory, setExperienceCategory] = useState(experienceKey || "all");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [invites, setInvites] = useState("");
  const [chambres, setChambres] = useState("");
  const [sallesDeBain, setSallesDeBain] = useState("");
  const [rabaisOnly, setRabaisOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [activities, setActivities] = useState({
    peche: false,
    ski: false,
  });

  const [tags, setTags] = useState({
    luxe: false,
    romantique: false,
    famille: false,
    groupe: false,
    nature: false,
    eau: false,
    montagne: false,
    rustique: false,
    scandinave: false,
    couple: false,
    activités: false,
    glamping: false,
    unique: false,
    hiver: false,
    été: false,
    touristique: false,
    vue: false,
    mer: false,
    jeux: false,
  });

  const [features, setFeatures] = useState(() => featuresFromExperienceKey(experienceKey));

  const [sortOption, setSortOption] = useState("date");

  const urlFeatureBaseline = useMemo(
    () => featuresFromExperienceKey(experienceKey),
    [experienceKey]
  );

  const handleFeatureChange = (name) => {
    setFeatures((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleActivityChange = (name) => {
    setActivities((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleTagChange = (name) => {
    setTags((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    const next = parseListingPageSlug(pageSlug);
    if (!next.valid) return;
    setRegionCategory(next.regionKey);
    setExperienceCategory(next.experienceKey || "all");
    setFeatures(featuresFromExperienceKey(next.experienceKey));
    const config = getExperienceConfig(next.experienceKey) || getRegionConfig(next.regionKey);
    document.title = config.documentTitle;
  }, [pageSlug]);

  useEffect(() => {
    const { searchQuery: homeSearch, activities: homeActivities, tags: homeTags } =
      location.state || {};

    if (!homeSearch && !homeActivities && !homeTags) return;

    if (homeSearch) setSearchQuery(homeSearch);
    if (homeActivities) {
      setActivities((prev) => ({ ...prev, ...homeActivities }));
    }
    if (homeTags) {
      setTags((prev) => ({ ...prev, ...homeTags }));
    }

    navigate(location.pathname, { replace: true, state: null });
  }, [location.state, location.pathname, navigate]);

  const hasExtraFeatureFilters = Object.keys(features).some(
    (key) => features[key] !== urlFeatureBaseline[key]
  );

  const hasActiveFilters =
    searchQuery ||
    locationQuery ||
    minPrice ||
    maxPrice ||
    invites ||
    chambres ||
    sallesDeBain ||
    rabaisOnly ||
    hasExtraFeatureFilters ||
    Object.values(activities).some(Boolean) ||
    Object.values(tags).some(Boolean);

  const handleResetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setMinPrice("");
    setMaxPrice("");
    setInvites("");
    setChambres("");
    setSallesDeBain("");
    setRabaisOnly(false);
    setActivities({ peche: false, ski: false });
    setTags({
      luxe: false,
      romantique: false,
      famille: false,
      groupe: false,
      nature: false,
      eau: false,
      montagne: false,
      rustique: false,
      scandinave: false,
      couple: false,
      activités: false,
      glamping: false,
      unique: false,
      hiver: false,
      été: false,
      touristique: false,
      vue: false,
      mer: false,
      jeux: false,
    });
    setFeatures({ ...EMPTY_FEATURES_STATE });
    setSortOption("date");
    setShowMap(false);
    navigate("/chalets/chalet-a-louer/");
  };

  const navigateToRegion = (key) => {
    setRegionCategory(key);
    setExperienceCategory("all");
    setFeatures({ ...EMPTY_FEATURES_STATE });
    navigate(`/chalets/${getPageSlugFromListing(key, null)}/`);
  };

  const navigateToExperience = (key) => {
    setExperienceCategory(key);
    setRegionCategory("all");
    const expKey = key === "all" ? null : key;
    setFeatures(featuresFromExperienceKey(expKey));
    navigate(`/chalets/${getPageSlugFromListing("all", expKey)}/`);
  };

  const filteredChalets = useMemo(() => {
    const matchRegion = getRegionConfig(regionCategory).match;
    const matchExperience = experienceKey
      ? getExperienceConfig(experienceKey).match
      : () => true;

    return chalets
      .filter((chalet) => {
        if (!matchRegion(chalet) || !matchExperience(chalet)) return false;

        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchesName = chalet.nom?.toLowerCase().includes(query);
          const matchesSub = chalet.sousTitre?.toLowerCase().includes(query);
          const matchesDesc = chalet.description?.toLowerCase().includes(query);
          const matchesCitq = chalet.citq?.toLowerCase().includes(query);
          const matchesLoc = chalet.localisation?.toLowerCase().includes(query);
          const matchesRegion = (chalet.region || "").toLowerCase().includes(query);
          const matchesRegionLabel = (chalet.regionLabel || "").toLowerCase().includes(query);
          if (
            !matchesName &&
            !matchesSub &&
            !matchesDesc &&
            !matchesCitq &&
            !matchesLoc &&
            !matchesRegion &&
            !matchesRegionLabel
          ) {
            return false;
          }
        }

        if (locationQuery.trim() !== "") {
          const loc = locationQuery.toLowerCase();
          if (!chalet.localisation?.toLowerCase().includes(loc)) {
            return false;
          }
        }

        const price = chalet.prixNuit;
        if (price !== null && price !== undefined) {
          if (minPrice && price < parseFloat(minPrice)) return false;
          if (maxPrice && price > parseFloat(maxPrice)) return false;
        } else if (minPrice || maxPrice) {
          return false;
        }

        if (invites && chalet.invites < parseInt(invites, 10)) return false;
        if (chambres && (chalet.chambres ?? 0) < parseInt(chambres, 10)) return false;
        if (sallesDeBain && (chalet.sdb ?? 0) < parseInt(sallesDeBain, 10)) return false;

        if (rabaisOnly && chalet.prixNuit > 200) return false;

        const activeActivities = Object.entries(activities)
          .filter(([, on]) => on)
          .map(([key]) => key);
        if (activeActivities.length > 0) {
          const chaletActivities = chalet.activites || [];
          if (!activeActivities.every((a) => chaletActivities.includes(a))) {
            return false;
          }
        }

        const activeTags = Object.entries(tags)
          .filter(([, on]) => on)
          .map(([key]) => key);
        if (activeTags.length > 0) {
          const chaletTags = chalet.tags || [];
          if (!activeTags.every((t) => chaletTags.includes(t))) {
            return false;
          }
        }

        for (const { key } of SIDEBAR_FEATURE_OPTIONS) {
          if (features[key] && !chaletHasFeature(chalet, key)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "title") return a.nom.localeCompare(b.nom);
        if (sortOption === "price_asc") {
          return (a.prixNuit ?? 999999) - (b.prixNuit ?? 999999);
        }
        if (sortOption === "price_desc") {
          return (b.prixNuit ?? -1) - (a.prixNuit ?? -1);
        }
        const parseDate = (dStr) => {
          if (!dStr) return 0;
          const months = {
            janvier: 0, février: 1, mars: 2, avril: 3, mai: 4, juin: 5,
            juillet: 6, août: 7, septembre: 8, octobre: 9, novembre: 10, décembre: 11,
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
    chalets,
    regionCategory,
    experienceKey,
    searchQuery,
    locationQuery,
    minPrice,
    maxPrice,
    invites,
    chambres,
    sallesDeBain,
    rabaisOnly,
    activities,
    tags,
    features,
    sortOption,
  ]);

  const mapChalets = filteredChalets.filter((c) => c.coordonnees?.lat && c.coordonnees?.lng);

  if (loading) {
    return (
      <div className="listing-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">CHALETS À LOUER</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement des annonces…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="listing-page" style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger les chalets
        </h1>
        <p style={{ color: "#4A4A48" }}>{error.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  if (isInvalidSlug) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">404</div>
        <h1 className="section-title" style={{ fontSize: 48, marginTop: 12 }}>Page introuvable</h1>
        <Link to="/chalets/chalet-a-louer/" className="section-link" style={{ display: "inline-block", marginTop: 24 }}>
          Voir les chalets à louer →
        </Link>
      </div>
    );
  }

  const breadcrumbLeaf =
    experienceConfig?.breadcrumb || (regionKey !== "all" ? regionConfig.breadcrumb : null);

  return (
    <div className="listing-page">
      <nav className="breadcrumb" style={{ background: "#fff", padding: "18px 36px 0" }}>
        <Link to="/">Accueil</Link>
        <span className="separator"> / </span>
        {breadcrumbLeaf ? (
          <>
            <Link to="/chalets/chalet-a-louer/">Chalets à louer</Link>
            <span className="separator"> / </span>
            <span style={{ color: "#1A1A1A" }}>{breadcrumbLeaf}</span>
          </>
        ) : (
          <span style={{ color: "#1A1A1A" }}>Chalets à louer</span>
        )}
      </nav>

      <section className="header-hero listing-hero">
        <div className="header-hero__content">
          <div className="container">
            <div className="hp-listing-category__header">
              <div className="hp-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div className="hp-listing-category__item-count">
                    {filteredChalets.length} annonce{filteredChalets.length !== 1 ? "s" : ""}
                  </div>
                  <h1 className="hp-listing-category__name">{pageConfig.title}</h1>
                  <p className="hp-listing-category__description">
                    {regionKey === "laurentides" && !experienceKey ? (
                      <>
                        {regionConfig.description} Parcourez nos annonces de{" "}
                        <strong>chalets avec spa</strong>, <strong>chalets au bord de l&apos;eau</strong> ou encore de{" "}
                        <strong>chalet A-Frame</strong> en pleine nature.
                      </>
                    ) : (
                      pageConfig.description
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="site-content" style={{ padding: "0 36px 52px" }}>
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
            <button type="button" className="search-btn">⌕ Filtrer</button>
          </div>
        </div>

        <div className="listing-main-grid">
          <aside className="listing-sidebar">
            <div className="filter-widget">
              <div className="filter-widget-header">
                <h3>Filtres de recherche</h3>
                {hasActiveFilters && (
                  <button type="button" onClick={handleResetFilters} className="btn-reset-filters">
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="filter-section">
                <label className="filter-label">Région du Québec</label>
                {regionConfig.categoryLabel && !experienceKey && (
                  <p className="listing-category-path">
                    Chalets à louer
                    <span className="listing-category-path__sep"> › </span>
                    {regionConfig.categoryLabel}
                  </p>
                )}
                <div className="category-radios">
                  {REGION_NAV_ITEMS.map((cat) => (
                    <label key={cat.key} className="radio-container">
                      <input
                        type="radio"
                        name="region"
                        checked={regionCategory === cat.key}
                        onChange={() => navigateToRegion(cat.key)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Par expérience</label>
                {experienceConfig?.categoryLabel && (
                  <p className="listing-category-path">
                    Chalets à louer
                    <span className="listing-category-path__sep"> › </span>
                    {experienceConfig.categoryLabel}
                  </p>
                )}
                <div className="category-radios">
                  {EXPERIENCE_NAV_ITEMS.map((cat) => (
                    <label key={cat.key} className="radio-container">
                      <input
                        type="radio"
                        name="experience"
                        checked={experienceCategory === cat.key}
                        onChange={() => navigateToExperience(cat.key)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Activités à proximité</label>
                <div className="checkbox-list">
                  {ACTIVITY_OPTIONS.map((act) => (
                    <label key={act.key} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={activities[act.key]}
                        onChange={() => handleActivityChange(act.key)}
                      />
                      <span>{act.label}</span>
                    </label>
                  ))}
                </div>
              </div>

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

              <div className="filter-section">
                <label className="filter-label">Capacité d&apos;accueil</label>
                <select value={invites} onChange={(e) => setInvites(e.target.value)}>
                  <option value="">Nombre d&apos;invités</option>
                  {[...Array(20)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}+ invité{i > 0 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>

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

              <div className="filter-section">
                <label className="filter-label">Commodités</label>
                <div className="checkbox-list">
                  {SIDEBAR_FEATURE_OPTIONS.map((feat) => (
                    <label key={feat.key} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={features[feat.key]}
                        onChange={() => handleFeatureChange(feat.key)}
                      />
                      <span>{feat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-section">
                <label className="filter-label">Tags</label>
                <div className="checkbox-list">
                  {TAG_OPTIONS.map((tag) => (
                    <label key={tag.key} className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={tags[tag.key]}
                        onChange={() => handleTagChange(tag.key)}
                      />
                      <span>{tag.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="listing-content-area">
            <div className="listing-topbar">
              <div className="results-count">
                Affichage de 1-{filteredChalets.length} résultats sur {filteredChalets.length}
              </div>
              <div className="listing-topbar-actions">
                <button
                  type="button"
                  className={`btn-show-map${showMap ? " active" : ""}`}
                  onClick={() => setShowMap((v) => !v)}
                >
                  {showMap ? "Masquer la carte" : "Afficher la carte"}
                </button>
                <div className="sort-by">
                  <span>Trier par</span>
                  <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                    <option value="date">Date d&apos;ajout</option>
                    <option value="title">Titre (A-Z)</option>
                    <option value="price_asc">Prix croissant</option>
                    <option value="price_desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            </div>

            {showMap && mapChalets.length > 0 && (
              <div className="listing-map-panel">
                <iframe
                  title="Carte des chalets"
                  className="listing-map-iframe"
                  loading="lazy"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${Math.min(...mapChalets.map((c) => c.coordonnees.lng)) - 0.15}%2C${Math.min(...mapChalets.map((c) => c.coordonnees.lat)) - 0.08}%2C${Math.max(...mapChalets.map((c) => c.coordonnees.lng)) + 0.15}%2C${Math.max(...mapChalets.map((c) => c.coordonnees.lat)) + 0.08}&layer=mapnik`}
                />
                <p className="listing-map-hint">
                  {mapChalets.length} chalet{mapChalets.length !== 1 ? "s" : ""} affiché{mapChalets.length !== 1 ? "s" : ""} dans cette sélection.
                </p>
              </div>
            )}

            {filteredChalets.length > 0 ? (
              <div className="chalets-grid listing-chalets-grid">
                {filteredChalets.map((chalet) => (
                  <ChaletCard key={chalet.id} chalet={chalet} variant="listing" />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>Aucun chalet trouvé</h3>
                <p>Essayez de modifier ou de réinitialiser vos filtres de recherche.</p>
                <button
                  type="button"
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

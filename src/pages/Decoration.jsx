// src/pages/Decoration.jsx
// Page catégorie "Décoration" — reproduit chaletpedia.com/chalets/decoration/
import { useMemo, useState } from "react";

const CATEGORIE = "Décoration";
const DESCRIPTION = "Mobilier, aménagement et décoration intérieure & extérieure.";
const HERO_IMAGE = "/images/services/decoration.webp";

const annonces = [
  {
    id: "meubles-cle-en-main",
    titre: "Meubles de chalet clé en main – lot complet à vendre",
    localisation: "Québec, Canada",
    date: "3 octobre 2025",
    image: "/images/services/MeubleDeChalet.webp",
  },
  {
    id: "verbois-meubles",
    titre: "Verbois - Meubles contemporains fabriqués au Québec",
    localisation: "Rivière-du-Loup, Québec, Canada",
    date: "17 janvier 2025",
    image: "/images/services/Verbois.webp",
  },
  {
    id: "rustik-decorations",
    titre: "RUSTIK | Décorations en bois pour chalets 🪵",
    localisation: "Saint-Sauveur, Québec, Canada",
    date: "28 octobre 2024",
    image: "/images/services/Rustik.webp",
  },
];

export default function Decoration() {
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
          aria-label="Recherche dans Décoration"
        >
          <div className="search-bar services-search-bar services-search-bar--solo">
            <div className="search-field" style={{ borderRight: "none" }}>
              <div className="label">Rechercher dans Décoration</div>
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

        <div className="services-toolbar">
          <span className="services-toolbar__count">
            Affichage de {count} résultat{count > 1 ? "s" : ""} sur {annonces.length}
          </span>
          <div className="services-toolbar__sort">
            <label htmlFor="sort-decoration">Trier par</label>
            <select
              id="sort-decoration"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="title">Titre</option>
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
              <article
                key={a.id}
                className="service-listing-card"
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
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

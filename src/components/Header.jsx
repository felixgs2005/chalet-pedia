// src/components/Header.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { LISTING_EXPERIENCES } from "../data/listingExperiences";
import { LISTING_PREFIX } from "../data/listingPageSlug";

const HEADER_EXPERIENCE_KEYS = ["animaux", "bordEau", "spa", "boise"];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Link to="/" className="logo">
        CHALET<span>PEDIA</span>
      </Link>

      <nav className={`nav${menuOpen ? " open" : ""}`}>
        <button
          className="nav-close"
          style={{ display: "none" }}
          onClick={() => setMenuOpen(false)}
        >
          ✕
        </button>

        <div className="nav-item">
          <span className="nav-link">
            Chalets à louer <span className="caret">▾</span>
          </span>
          <div className="submenu">
            <div className="submenu-label">Par Région</div>
            <Link to="/chalets/chalet-a-louer/" onClick={() => setMenuOpen(false)}>
              Toutes les régions
            </Link>
            <Link to="/chalets/chalets-a-louer-laurentides/" onClick={() => setMenuOpen(false)}>
              Laurentides
            </Link>
            <Link to="/chalets/chalets-a-louer-gaspesie/" onClick={() => setMenuOpen(false)}>
              Gaspésie
            </Link>
            <Link
              to="/chalets/chalets-a-louer-saguenay-lac-saint-jean/"
              onClick={() => setMenuOpen(false)}
            >
              Saguenay-Lac-Saint-Jean
            </Link>
            <div className="submenu-label" style={{ marginTop: 8 }}>Par Expérience</div>
            {HEADER_EXPERIENCE_KEYS.map((key) => {
              const exp = LISTING_EXPERIENCES[key];
              return (
                <Link
                  key={key}
                  to={`/chalets/${LISTING_PREFIX}${exp.slug}/`}
                  onClick={() => setMenuOpen(false)}
                >
                  {exp.menuIcon} {exp.menuLabel}
                </Link>
              );
            })}
          </div>
        </div>

        <Link to="/chalets/chalets-a-vendre/">Chalets à vendre</Link>

        <div className="nav-item">
          <Link to="/chalets/services/" className="nav-link" onClick={() => setMenuOpen(false)}>
            Services <span className="caret">▾</span>
          </Link>
          <div className="submenu">
            <Link to="/chalets/construction/" onClick={() => setMenuOpen(false)}>| Construction</Link>
            <Link to="/chalets/decoration/" onClick={() => setMenuOpen(false)}>| Décoration</Link>
            <Link to="/chalets/entretien/" onClick={() => setMenuOpen(false)}>| Entretien</Link>
            <Link to="/chalets/multimedia/" onClick={() => setMenuOpen(false)}>Multimédia</Link>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">
            Académie <span className="caret">▾</span>
          </span>
          <div className="submenu">
            <Link to="/academie/astuces/" onClick={() => setMenuOpen(false)}>
              | Astuces
            </Link>
            <a href="#">| Formations</a>
            <Link to="/academie/astuces/Wikia" onClick={() => setMenuOpen(false)}>| Wikia</Link>
          </div>
        </div>

        <Link to="/blogue/">Blogue</Link>
        <Link to="/auth" className="nav-login" onClick={() => setMenuOpen(false)}>
          Se connecter
        </Link>

        <Link
          to="/annoncez-votre-chalet/"
          className="btn-annoncer"
          style={{ display: "none" }}
          onClick={() => setMenuOpen(false)}
        >
          Annoncez →
        </Link>
      </nav>

      <Link to="/annoncez-votre-chalet/" className="btn-annoncer">
        Annoncez →
      </Link>

      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>
    </header>
  );
}

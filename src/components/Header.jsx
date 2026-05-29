// src/components/Header.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

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
            <Link to="/chalets/chalet-a-louer/">Toutes les régions</Link>
            <Link to="/chalets/chalets-a-louer-laurentides/">Laurentides</Link>
            <Link to="/chalets/chalets-a-louer-gaspesie/">Gaspésie</Link>
            <Link to="/chalets/chalets-a-louer-saguenay-lac-saint-jean/">Saguenay-Lac-Saint-Jean</Link>
            <div className="submenu-label" style={{ marginTop: 8 }}>Par Expérience</div>
            <a href="#animaux">🐕 Animaux permis</a>
            <a href="#eau">💦 Bord de l'eau</a>
            <a href="#spa">♨ Avec spa</a>
            <a href="#foret">🌲 Secteur boisé</a>
          </div>
        </div>

        <Link to="/chalets/chalets-a-vendre/">Chalets à vendre</Link>

        <div className="nav-item">
          <span className="nav-link">
            Services <span className="caret">▾</span>
          </span>
          <div className="submenu">
            <a href="#">| Construction</a>
            <a href="#">| Décoration</a>
            <a href="#">| Entretien</a>
            <a href="#">Multimédia</a>
          </div>
        </div>

        <div className="nav-item">
          <span className="nav-link">
            Académie <span className="caret">▾</span>
          </span>
          <div className="submenu">
            <a href="#">| Astuces</a>
            <a href="#">| Formations</a>
            <a href="#">| Wikia</a>
          </div>
        </div>

        <Link to="/blogue/">Blogue</Link>
        <a href="#connexion">Se connecter</a>

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

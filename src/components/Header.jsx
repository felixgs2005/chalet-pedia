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
            <a href="/chalets/chalets-a-louer-laurentides/">Laurentides</a>
            <a href="/chalets/chalets-a-louer-gaspesie/">Gaspésie</a>
            <a href="/chalets/chalets-a-louer-saguenay-lac-saint-jean/">Saguenay-Lac-Saint-Jean</a>
            <div className="submenu-label" style={{ marginTop: 8 }}>Par Expérience</div>
            <a href="#animaux">🐕 Animaux permis</a>
            <a href="#eau">💦 Bord de l'eau</a>
            <a href="#spa">♨ Avec spa</a>
            <a href="#foret">🌲 Secteur boisé</a>
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
            <a href="#">| Astuces</a>
            <a href="#">| Formations</a>
            <a href="#">| Wikia</a>
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

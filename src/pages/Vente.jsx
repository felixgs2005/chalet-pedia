// src/pages/Vente.jsx
// ============================================================
// PAGE CHALETS À VENDRE — LISTE (DYNAMIQUE)
// Générée à partir de src/data/ventes.js.
// ============================================================

import { Link } from "react-router-dom";
import { ventes } from "../data/ventes";
import { PinIcon, BedIcon, BathIcon, GarageIcon } from "../components/Icons";

export default function Vente() {
  return (
    <div className="vente-page">
      <section className="page-hero">
        <div className="page-kicker">CHALETS À VENDRE · QUÉBEC</div>
        <h1 className="page-title">
          Trouvez votre futur
          <br />
          chez-vous en nature.
        </h1>
        <p className="page-sub">
          Propriétés exceptionnelles à travers les régions du Québec, vendues directement par leurs
          propriétaires.
        </p>
      </section>

      <div className="listings-section">
        <div className="listings-count">
          <strong>
            {ventes.length} chalet{ventes.length > 1 ? "s" : ""} à vendre
          </strong>{" "}
          · trié par : plus récents
        </div>

        <div className="listings-grid">
          {ventes.map((v) => (
            <Link
              key={v.id}
              to={`/chalets/chalets-a-vendre/${v.slug}`}
              className="listing-card"
            >
              <div className="listing-img" style={{ backgroundImage: `url('${v.cardImage}')` }}>
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
      </div>
    </div>
  );
}

// src/components/ChaletCard.jsx
import { Link } from "react-router-dom";

export default function ChaletCard({ chalet }) {
  return (
    <Link to={`/chalet/${chalet.slug}`} className="chalet" style={{ textDecoration: "none", color: "inherit" }}>
      <div
        className="chalet-img"
        style={{ backgroundImage: `url('${chalet.images[0]}')` }}
      >
        <div className="chalet-badge">{chalet.badge}</div>
        <button className="chalet-heart" onClick={(e) => e.preventDefault()}>
          {chalet.isFavori ? "♥" : "♡"}
        </button>
      </div>
      <div className="chalet-info">
        <div className="chalet-name">{chalet.nom}</div>
        {chalet.sousTitre && (
          <div className="chalet-subtitle">{chalet.sousTitre}</div>
        )}
        <div className="chalet-location">📍 {chalet.localisation}</div>
        <div className="chalet-meta">
          <span>👥 {chalet.invites} invités</span>
          {chalet.chambres != null && (
            <span>🛏 {chalet.chambres} chambre{chalet.chambres > 1 ? "s" : ""}</span>
          )}
        </div>
        <div className="chalet-footer">
          <div className="chalet-price">
            {chalet.prixNuit ? (
              <>
                <span className="from">À partir de</span>
                <span>
                  {chalet.prixNuit}$<small> / nuit</small>
                </span>
              </>
            ) : (
              <span style={{ fontSize: 12, color: "#9A9A98" }}>Prix sur demande</span>
            )}
          </div>
          <span className="chalet-cta">Réserver →</span>
        </div>
      </div>
    </Link>
  );
}

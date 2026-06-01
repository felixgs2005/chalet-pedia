// src/components/ChaletCard.jsx
import { Link } from "react-router-dom";

export default function ChaletCard({ chalet, variant = "default" }) {
  const isListing = variant === "listing";
  const displayName =
    isListing && chalet.sousTitre
      ? `${chalet.nom} | ${chalet.sousTitre}`
      : chalet.nom;

  return (
    <Link
      to={`/chalet/${chalet.slug}`}
      className={`chalet${isListing ? " chalet--listing" : ""}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        className="chalet-img"
        style={{ backgroundImage: `url('${chalet.images[0]}')` }}
      >
        <div className="chalet-badge">{chalet.badge}</div>
        <button className="chalet-heart" type="button" onClick={(e) => e.preventDefault()}>
          {chalet.isFavori ? "♥" : "♡"}
        </button>
      </div>
      <div className="chalet-info">
        <div className="chalet-name">{displayName}</div>
        {!isListing && chalet.sousTitre && (
          <div className="chalet-subtitle">{chalet.sousTitre}</div>
        )}
        <div className="chalet-location">📍 {chalet.localisation}</div>
        {isListing && chalet.dateAjout && (
          <div className="chalet-date">Ajouté le {chalet.dateAjout}</div>
        )}
        <div className="chalet-meta">
          <span>👥 {chalet.invites} invités</span>
          {chalet.chambres != null && (
            <span>
              🛏 {chalet.chambres} chambre{chalet.chambres > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <div className="chalet-footer">
          <div className="chalet-price">
            {chalet.prixNuit != null ? (
              <>
                <span className="from">À partir de</span>
                <span>
                  {chalet.prixNuit}$
                  <small> / nuit</small>
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

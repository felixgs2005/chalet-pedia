import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useFavoris } from "../../hooks/useFavoris";
import { useFavorisCount } from "../../context/FavorisCountContext";

const TYPE_LABELS = {
  chalet: "Chalet à louer",
  service: "Service",
  vente: "Chalet à vendre",
};

export default function Favoris() {
  const { favoris, loading, error } = useFavoris();
  const { refresh: refreshCount } = useFavorisCount();

  useEffect(() => {
    if (!loading) refreshCount();
  }, [loading, favoris.length, refreshCount]);

  const total = favoris.length;

  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner compte-reglages__inner--wide">
        <div className="compte-favoris-head">
          <h1 className="compte-reglages__title">Favoris</h1>
          {!loading && total > 0 && (
            <span className="compte-favoris-count" aria-live="polite">
              {total} {total > 1 ? "favoris" : "favori"}
            </span>
          )}
        </div>

        {loading && <p className="compte-reglages__loading">Chargement de vos favoris…</p>}

        {error && (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error.message || "Impossible de charger vos favoris."}
          </div>
        )}

        {!loading && !error && favoris.length === 0 && (
          <p className="compte-reglages__loading">Vous n&apos;avez pas encore de favoris.</p>
        )}

        {!loading && favoris.length > 0 && (
          <ul className="compte-favoris-list">
            {favoris.map((item) => (
              <li key={item.id} className="compte-favoris-card">
                {item.image && (
                  <div
                    className="compte-favoris-card__img"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                )}
                <div className="compte-favoris-card__body">
                  <div className="compte-favoris-card__meta">
                    <span className="compte-favoris-card__type">
                      {TYPE_LABELS[item.typeEntite] || item.typeEntite}
                    </span>
                    <span className="compte-favoris-card__user">
                      Ajouté par {item.auteur}
                    </span>
                  </div>
                  <Link to={item.entiteUrl} className="compte-favoris-card__title">
                    {item.entiteTitre}
                  </Link>
                  {item.localisation && (
                    <p className="compte-favoris-card__loc">📍 {item.localisation}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link to="/" className="compte-reglages__back">
          ← Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}

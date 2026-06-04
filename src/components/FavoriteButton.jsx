import { useState } from "react";
import { Link } from "react-router-dom";
import { useFavoriEntite } from "../hooks/useFavoriEntite";
import { useFavorisCount } from "../context/FavorisCountContext";

/** Bouton favori lié à la collection Firestore `favoris`. */
export default function FavoriteButton({ cible, className = "action-btn", variant = "button" }) {
  const { favorited, loading, toggle, isLoggedIn } = useFavoriEntite(cible);
  const { refresh: refreshFavorisCount } = useFavorisCount();
  const [error, setError] = useState("");

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");
    try {
      await toggle();
      refreshFavorisCount();
    } catch (err) {
      setError(err.message || "Impossible de mettre à jour les favoris.");
    }
  };

  if (!cible) return null;

  const label = favorited ? "♥ Favori" : "♡ Ajouter aux favoris";
  const heartOnly = variant === "heart";

  if (!isLoggedIn) {
    if (heartOnly) {
      return (
        <Link
          to="/auth"
          className={className}
          onClick={(e) => e.stopPropagation()}
          title="Connectez-vous pour ajouter aux favoris"
        >
          ♡
        </Link>
      );
    }
    return (
      <Link to="/auth" className={className} onClick={(e) => e.stopPropagation()}>
        ♡ Ajouter aux favoris
      </Link>
    );
  }

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={handleClick}
        disabled={loading}
        aria-pressed={favorited}
        title={error || undefined}
      >
        {heartOnly ? (favorited ? "♥" : "♡") : label}
      </button>
    </>
  );
}

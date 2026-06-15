import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Redirige vers /auth si non connecté, refuse l'accès si l'utilisateur n'est pas admin. */
export default function RequireAdmin({ children }) {
  const { currentUser, isAdmin, loading, profileLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const authReady = !loading;
  const profileReady = authReady && (!currentUser || !profileLoading);

  useEffect(() => {
    if (!profileReady) return;

    if (!currentUser) {
      const returnTo = `${location.pathname}${location.search}`;
      navigate("/auth", { replace: true, state: { from: returnTo } });
    }
  }, [currentUser, profileReady, navigate, location.pathname, location.search]);

  if (!profileReady || !currentUser) {
    return (
      <div className="compte-page compte-page--loading">
        <p>Chargement…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="compte-page">
        <div className="compte-reglages">
          <h1 className="compte-reglages__title">Accès refusé</h1>
          <p className="compte-reglages__subtitle">
            Cette section est réservée aux administrateurs.
          </p>
          <Link to="/" className="compte-reglages__submit">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

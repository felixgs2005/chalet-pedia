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
      <div className="compte-page compte-access-denied">
        <div className="compte-access-denied__card">
          <div className="compte-access-denied__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.75" />
              <path
                d="M8 11V8a4 4 0 1 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="compte-access-denied__kicker">Administration</p>
          <h1 className="compte-access-denied__title">Accès refusé</h1>
          <p className="compte-access-denied__text">
            Cette section est réservée aux administrateurs. Connectez-vous avec un compte autorisé ou
            retournez à l&apos;accueil.
          </p>
          <Link to="/" className="compte-access-denied__cta">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return children;
}

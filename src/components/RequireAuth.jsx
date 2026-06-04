import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Redirige vers /auth si l'utilisateur n'est pas connecté. */
export default function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !currentUser) {
      const returnTo = `${location.pathname}${location.search}`;
      navigate("/auth", { replace: true, state: { from: returnTo } });
    }
  }, [currentUser, loading, navigate, location.pathname, location.search]);

  if (loading || !currentUser) {
    return (
      <div className="compte-page compte-page--loading">
        <p>Chargement…</p>
      </div>
    );
  }

  return children;
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/** Redirige vers /auth si l'utilisateur n'est pas connecté. */
export default function RequireAuth({ children }) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate("/auth", { replace: true });
    }
  }, [currentUser, loading, navigate]);

  if (loading || !currentUser) {
    return (
      <div className="compte-page compte-page--loading">
        <p>Chargement…</p>
      </div>
    );
  }

  return children;
}

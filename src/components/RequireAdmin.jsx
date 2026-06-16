import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import "../styles/admin.css";

/** Redirige vers /admin/login si la session admin n'est pas active. */
export default function RequireAdmin({ children }) {
  const { isAdminAuthenticated, loading } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!isAdminAuthenticated) {
      const returnTo = `${location.pathname}${location.search}`;
      navigate("/admin/login", { replace: true, state: { from: returnTo } });
    }
  }, [isAdminAuthenticated, loading, navigate, location.pathname, location.search]);

  if (loading || !isAdminAuthenticated) {
    return (
      <div className="admin-dashboard admin-dashboard--loading">
        <div className="admin-dashboard__loader" aria-hidden="true" />
        <p>Chargement…</p>
      </div>
    );
  }

  return children;
}

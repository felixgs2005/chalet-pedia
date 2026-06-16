import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import "../../styles/admin-login.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdminAuthenticated, loading, login } = useAdminAuth();
  const returnTo = location.state?.from || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAdminAuthenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [isAdminAuthenticated, loading, navigate, returnTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(email, password);
      navigate(returnTo, { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-login-page admin-login-page--loading">
        <p>Chargement…</p>
      </div>
    );
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-card__title">Connexion Admin</h1>

        <form className="admin-login-form" onSubmit={handleSubmit} noValidate>
          {error ? (
            <div className="admin-login-form__error" role="alert">
              {error}
            </div>
          ) : null}

          <label className="admin-login-form__field">
            <span className="admin-login-form__label">Email</span>
            <input
              type="email"
              name="email"
              autoComplete="username"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="admin-login-form__field">
            <span className="admin-login-form__label">Mot de passe</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="admin-login-form__submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <Link to="/" className="admin-login-card__back">
          ← Retour au site
        </Link>
      </div>
    </div>
  );
}

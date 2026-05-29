import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";

/** Page d’accueil visible derrière la modale (header reste au-dessus via z-index). */
export function AuthPage() {
  return (
    <>
      <HomePage />
      <Auth />
    </>
  );
}

function Auth() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => navigate("/"), 280);
  }, [closing, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const pageClass = [
    "auth-page",
    visible && !closing ? "auth-page--visible" : "",
    closing ? "auth-page--closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={pageClass} role="dialog" aria-modal="true" aria-labelledby="auth-title">
      <button
        type="button"
        className="auth-page__backdrop"
        aria-label="Fermer"
        onClick={handleClose}
      />

      <div className="auth-modal">
        <button
          type="button"
          className="auth-modal__close"
          aria-label="Fermer"
          onClick={handleClose}
        >
          ×
        </button>

        <Link to="/" className="auth-modal__logo" onClick={(e) => e.stopPropagation()}>
          CHALET<span>PEDIA</span>
        </Link>

        <h1 id="auth-title" className="auth-modal__title">
          SE CONNECTER.
        </h1>
        <p className="auth-modal__subtitle">
          Accédez à votre espace pour gérer vos annonces, vos favoris et vos messages.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label" htmlFor="auth-identifier">
            Identifiant ou e-mail
          </label>
          <input
            id="auth-identifier"
            type="text"
            className="auth-form__input"
            placeholder="votre@courriel.com"
            autoComplete="username"
          />

          <label className="auth-form__label" htmlFor="auth-password">
            Mot de passe
          </label>
          <input
            id="auth-password"
            type="password"
            className="auth-form__input"
            placeholder="••••••••"
            autoComplete="current-password"
          />

          <div className="auth-form__forgot">
            <a href="#mot-de-passe">Mot de passe oublié ?</a>
          </div>

          <button type="submit" className="auth-form__submit">
            Se connecter →
          </button>
        </form>

        <div className="auth-modal__divider">
          <span>ou</span>
        </div>

        <p className="auth-modal__signup">
          Vous n&apos;avez pas encore de compte ?{" "}
          <a href="#inscription">S&apos;inscrire</a>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

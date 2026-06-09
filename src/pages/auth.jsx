import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import { useAuth } from "../context/AuthContext";

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
  const location = useLocation();
  const { login, signup } = useAuth();
  const returnTo = location.state?.from;

  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => navigate("/", { replace: true }), 280);
  }, [closing, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      if (password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      setClosing(true);
      setVisible(false);
      window.setTimeout(() => navigate(returnTo || "/", { replace: true }), 280);
    } catch (err) {
      console.error(err);
      switch (err.code) {
        case "auth/user-not-found":
          setError("Aucun compte trouvé avec cet e-mail.");
          break;
        case "auth/wrong-password":
          setError("Mot de passe incorrect.");
          break;
        case "auth/invalid-email":
          setError("Adresse e-mail invalide.");
          break;
        case "auth/email-already-in-use":
          setError("Cette adresse e-mail est déjà utilisée.");
          break;
        case "auth/weak-password":
          setError("Le mot de passe doit contenir au moins 6 caractères.");
          break;
        case "auth/invalid-credential":
          setError("Identifiants de connexion invalides. Veuillez réessayer.");
          break;
        default:
          setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
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
          {isSignUp ? "S'INSCRIRE." : "SE CONNECTER."}
        </h1>
        <p className="auth-modal__subtitle">
          {isSignUp
            ? "Créez votre compte pour commencer à publier et gérer vos annonces."
            : "Accédez à votre espace pour gérer vos annonces, vos favoris et vos messages."}
        </p>

        {error && <div className="auth-form__error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-form__label" htmlFor="auth-identifier">
            Adresse e-mail
          </label>
          <input
            id="auth-identifier"
            type="email"
            required
            className="auth-form__input"
            placeholder="votre@courriel.com"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="auth-form__label" htmlFor="auth-password">
            Mot de passe
          </label>
          <input
            id="auth-password"
            type="password"
            required
            className="auth-form__input"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {isSignUp && (
            <>
              <label className="auth-form__label" htmlFor="auth-confirm-password">
                Confirmer le mot de passe
              </label>
              <input
                id="auth-confirm-password"
                type="password"
                required
                className="auth-form__input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </>
          )}

          {!isSignUp && (
            <div className="auth-form__forgot">
              <a href="#mot-de-passe">Mot de passe oublié ?</a>
            </div>
          )}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Chargement..." : isSignUp ? "S'inscrire →" : "Se connecter →"}
          </button>
        </form>

        <div className="auth-modal__divider">
          <span>ou</span>
        </div>

        <p className="auth-modal__signup">
          {isSignUp ? (
            <>
              Déjà un compte ?{" "}
              <a
                href="#connexion"
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                  setIsSignUp(false);
                }}
              >
                Se connecter
              </a>
            </>
          ) : (
            <>
              Vous n&apos;avez pas encore de compte ?{" "}
              <a
                href="#inscription"
                onClick={(e) => {
                  e.preventDefault();
                  setError("");
                  setIsSignUp(true);
                }}
              >
                S&apos;inscrire
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default AuthPage;

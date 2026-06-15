import { useEffect, useState, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomePage from "./HomePage";
import { useAuth } from "../context/AuthContext";
import {
  requestPasswordResetCode,
  resetPasswordWithCode,
} from "../services/passwordReset";

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
  const [mode, setMode] = useState("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "signup";
  const isForgotRequest = mode === "forgot-request";
  const isForgotReset = mode === "forgot-reset";

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (location.hash === "#mot-de-passe") {
      setMode("forgot-request");
      setError("");
      setSuccess("");
    }
  }, [location.hash]);

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => navigate("/", { replace: true }), 280);
  }, [closing, navigate]);

  const switchToLogin = () => {
    setMode("login");
    setError("");
    setSuccess("");
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isForgotRequest) {
      if (!email) {
        setError("Veuillez entrer votre adresse e-mail.");
        return;
      }
      try {
        setLoading(true);
        await requestPasswordResetCode(email);
        setSuccess(
          "Si un compte existe avec cette adresse, un code de sécurité vous a été envoyé par courriel."
        );
        setMode("forgot-reset");
      } catch (err) {
        setError(err.message || "Impossible d'envoyer le code.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isForgotReset) {
      if (!email || !resetCode || !newPassword || !confirmNewPassword) {
        setError("Veuillez remplir tous les champs.");
        return;
      }
      if (!/^\d{6}$/.test(resetCode.trim())) {
        setError("Le code doit contenir 6 chiffres.");
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError("Les mots de passe ne correspondent pas.");
        return;
      }
      if (newPassword.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }
      try {
        setLoading(true);
        await resetPasswordWithCode({
          email,
          code: resetCode.trim(),
          newPassword,
        });
        setSuccess("Mot de passe réinitialisé. Vous pouvez vous connecter.");
        setPassword("");
        setResetCode("");
        setNewPassword("");
        setConfirmNewPassword("");
        setMode("login");
      } catch (err) {
        setError(err.message || "Réinitialisation impossible.");
      } finally {
        setLoading(false);
      }
      return;
    }

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

  const title = isForgotRequest
    ? "MOT DE PASSE OUBLIÉ."
    : isForgotReset
      ? "NOUVEAU MOT DE PASSE."
      : isSignUp
        ? "S'INSCRIRE."
        : "SE CONNECTER.";

  const subtitle = isForgotRequest
    ? "Entrez votre adresse e-mail pour recevoir un code de sécurité."
    : isForgotReset
      ? "Entrez le code reçu par courriel et choisissez un nouveau mot de passe."
      : isSignUp
        ? "Créez votre compte pour commencer à publier et gérer vos annonces."
        : "Accédez à votre espace pour gérer vos annonces, vos favoris et vos messages.";

  const submitLabel = isForgotRequest
    ? "Envoyer le code →"
    : isForgotReset
      ? "Réinitialiser →"
      : isSignUp
        ? "S'inscrire →"
        : "Se connecter →";

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
          {title}
        </h1>
        <p className="auth-modal__subtitle">{subtitle}</p>

        {error && <div className="auth-form__error">{error}</div>}
        {success && <div className="auth-form__success">{success}</div>}

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
            readOnly={isForgotReset}
          />

          {isForgotReset && (
            <>
              <label className="auth-form__label" htmlFor="auth-reset-code">
                Code de sécurité
              </label>
              <input
                id="auth-reset-code"
                type="text"
                required
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                className="auth-form__input auth-form__input--code"
                placeholder="123456"
                autoComplete="one-time-code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              />

              <label className="auth-form__label" htmlFor="auth-new-password">
                Nouveau mot de passe
              </label>
              <input
                id="auth-new-password"
                type="password"
                required
                className="auth-form__input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label className="auth-form__label" htmlFor="auth-confirm-new-password">
                Confirmer le mot de passe
              </label>
              <input
                id="auth-confirm-new-password"
                type="password"
                required
                className="auth-form__input"
                placeholder="••••••••"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </>
          )}

          {!isForgotRequest && !isForgotReset && (
            <>
              <label className="auth-form__label" htmlFor="auth-password">
                Mot de passe
              </label>
              <input
                id="auth-password"
                type="password"
                required
                className="auth-form__input"
                placeholder="••••••••"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}

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

          {mode === "login" && (
            <div className="auth-form__forgot">
              <button
                type="button"
                className="auth-form__forgot-btn"
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setMode("forgot-request");
                }}
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          <button type="submit" className="auth-form__submit" disabled={loading}>
            {loading ? "Chargement..." : submitLabel}
          </button>
        </form>

        {(isForgotRequest || isForgotReset) && (
          <p className="auth-modal__signup">
            <button type="button" className="auth-form__link-btn" onClick={switchToLogin}>
              ← Retour à la connexion
            </button>
          </p>
        )}

        {!isForgotRequest && !isForgotReset && (
          <>
            <div className="auth-modal__divider">
              <span>ou</span>
            </div>

            <p className="auth-modal__signup">
              {isSignUp ? (
                <>
                  Déjà un compte ?{" "}
                  <button
                    type="button"
                    className="auth-form__link-btn"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setMode("login");
                    }}
                  >
                    Se connecter
                  </button>
                </>
              ) : (
                <>
                  Vous n&apos;avez pas encore de compte ?{" "}
                  <button
                    type="button"
                    className="auth-form__link-btn"
                    onClick={() => {
                      setError("");
                      setSuccess("");
                      setMode("signup");
                    }}
                  >
                    S&apos;inscrire
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionModal from "./ActionModal";
import { useAuth } from "../context/AuthContext";
import { submitAvis } from "../services/avisFirestore";

function StarRating({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);

  return (
    <div
      className="sd-action-modal__stars"
      role="radiogroup"
      aria-label="Évaluation"
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          className={`sd-action-modal__star${star <= (hover || value) ? " is-active" : ""}`}
          onMouseEnter={() => !disabled && setHover(star)}
          onClick={() => !disabled && onChange(star)}
          disabled={disabled}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/** Modale « Rédiger un avis » — enregistrement dans la collection Firestore `avis`. */
export default function ReviewModal({ open, onClose, cible, onSubmitted }) {
  const { currentUser } = useAuth();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setReview("");
      setSubmitting(false);
      setError("");
      setSent(false);
    }
  }, [open]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Rédiger un avis"
      titleId="sd-modal-review-title"
      renderBody={({ requestClose }) => (
        <>
          {!currentUser && (
            <p className="sd-action-modal__intro">
              <Link to="/auth" className="sd-action-modal__auth-link">
                Connectez-vous
              </Link>{" "}
              pour laisser un avis associé à votre compte.
            </p>
          )}
          <form
            className="sd-action-modal__form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (sent) {
                requestClose();
                return;
              }
              if (!cible?.typeEntite || !cible?.entiteId) {
                setError("Annonce introuvable.");
                return;
              }
              setError("");
              setSubmitting(true);
              try {
                await submitAvis(cible, {
                  note: rating,
                  texte: review,
                  utilisateur: currentUser,
                });
                setSent(true);
                onSubmitted?.();
                window.setTimeout(() => requestClose(), 1600);
              } catch (err) {
                setError(err.message || "Impossible d'envoyer l'avis. Réessayez.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {sent && (
              <div className="sd-action-modal__success" role="status">
                Merci, votre avis a été enregistré.
              </div>
            )}
            {error && (
              <div className="sd-action-modal__error" role="alert">
                {error}
              </div>
            )}
            <div className="sd-action-modal__field">
              <span className="sd-action-modal__label">Évaluation</span>
              <StarRating
                value={rating}
                onChange={setRating}
                disabled={sent || submitting || !currentUser}
              />
            </div>
            <div className="sd-action-modal__field">
              <label className="sd-action-modal__label" htmlFor="sd-review-text">
                Avis
              </label>
              <textarea
                id="sd-review-text"
                className="sd-action-modal__textarea"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                disabled={sent || submitting || !currentUser}
              />
            </div>
            <button
              type="submit"
              className="sd-action-modal__submit"
              disabled={sent || submitting || !currentUser}
            >
              {submitting ? "Envoi…" : "Envoyer un avis"}
            </button>
          </form>
        </>
      )}
    />
  );
}

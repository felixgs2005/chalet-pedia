import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionModal from "./ActionModal";
import { useAuth } from "../context/AuthContext";
import { sendMessage } from "../services/messagesFirestore";

/** Modale « Contacter l'annonceur » — enregistrement dans Firestore `messages`. */
export default function ContactModal({ open, onClose, cible, onSent }) {
  const { currentUser } = useAuth();
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setFile(null);
      setFileName("");
      setSubmitting(false);
      setError("");
      setSent(false);
    }
  }, [open]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Contacter l'annonceur"
      titleId="sd-modal-contact-title"
      renderBody={({ requestClose }) => (
        <>
          {!currentUser && (
            <p className="sd-action-modal__intro">
              <Link to="/auth" className="sd-action-modal__auth-link">
                Connectez-vous
              </Link>{" "}
              pour envoyer un message à l&apos;annonceur.
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
                const result = await sendMessage(cible, {
                  texte: message,
                  utilisateur: currentUser,
                  fichier: file,
                });
                setSent(true);
                onSent?.(result);
                window.setTimeout(() => requestClose(), 1600);
              } catch (err) {
                setError(err.message || "Impossible d'envoyer le message.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {sent && (
              <div className="sd-action-modal__success" role="status">
                Votre message a été envoyé.
              </div>
            )}
            {error && (
              <div className="sd-action-modal__error" role="alert">
                {error}
              </div>
            )}

            <div className="sd-action-modal__field">
              <label className="sd-action-modal__label" htmlFor="sd-contact-message">
                Message
              </label>
              <textarea
                id="sd-contact-message"
                className="sd-action-modal__textarea"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                disabled={sent || submitting || !currentUser}
              />
            </div>

            <div className="sd-action-modal__field">
              <span className="sd-action-modal__label sd-action-modal__label--muted">
                Fichier joint (facultatif)
              </span>
              <label className="sd-action-modal__file-btn">
                <input
                  type="file"
                  className="sd-action-modal__file-input"
                  disabled={sent || submitting || !currentUser}
                  onChange={(e) => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);
                    setFileName(selected?.name || "");
                  }}
                />
                {fileName || "Choisissez un fichier"}
              </label>
            </div>

            <button
              type="submit"
              className="sd-action-modal__submit"
              disabled={sent || submitting || !currentUser}
            >
              {submitting ? "Envoi…" : "Contacter l'annonceur"}
            </button>
          </form>
        </>
      )}
    />
  );
}

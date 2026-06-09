import { useEffect, useState } from "react";
import ActionModal from "./ActionModal";
import ContactModal from "./ContactModal";
import ReviewModal from "./ReviewModal";
import { useAuth } from "../context/AuthContext";
import { creerSignalement } from "../services/signalementsFirestore";

export function ReportModal({ open, onClose, listing }) {
  const { currentUser } = useAuth();
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setDetails("");
      setSubmitting(false);
      setError("");
      setSent(false);
    }
  }, [open]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Signaler l'annonce"
      titleId="sd-modal-report-title"
      renderBody={({ requestClose }) => (
      <>
      <p className="sd-action-modal__intro">
        Veuillez fournir les détails pour nous aider à vérifier que cette annonce viole les termes du service.
      </p>
      <form
        className="sd-action-modal__form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (sent) {
            requestClose();
            return;
          }
          if (!listing) {
            setError("Données de l'annonce introuvables.");
            return;
          }
          if (!details.trim()) {
            setError("Veuillez fournir des détails ou explications pour ce signalement.");
            return;
          }

          setError("");
          setSubmitting(true);
          try {
            await creerSignalement(listing, details, currentUser);
            setSent(true);
            window.setTimeout(() => requestClose(), 1600);
          } catch (err) {
            setError(err.message || "Impossible de soumettre le signalement. Veuillez réessayer.");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {sent && (
          <div className="sd-action-modal__success" role="status" style={{ marginBottom: 16 }}>
            Merci, votre signalement a été enregistré avec succès.
          </div>
        )}
        {error && (
          <div className="sd-action-modal__error" role="alert" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}
        <div className="sd-action-modal__field">
          <label className="sd-action-modal__label" htmlFor="sd-report-details">
            Détails
          </label>
          <textarea
            id="sd-report-details"
            className="sd-action-modal__textarea"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={6}
            disabled={sent || submitting}
            placeholder="Décrivez pourquoi cette annonce pose problème..."
          />
        </div>
        <button
          type="submit"
          className="sd-action-modal__submit"
          disabled={sent || submitting}
        >
          {submitting ? "Signalement en cours..." : "Signaler l'annonce"}
        </button>
      </form>
      </>
      )}
    />
  );
}

/** Modales fiche service : contact, avis, signalement. */
export default function ServiceListingModals({
  activeModal,
  onClose,
  avisCible,
  messageCible,
  onAvisSubmitted,
  listing,
}) {
  return (
    <>
      <ContactModal open={activeModal === "contact"} onClose={onClose} cible={messageCible} />
      <ReviewModal
        open={activeModal === "review"}
        onClose={onClose}
        cible={avisCible}
        onSubmitted={onAvisSubmitted}
      />
      <ReportModal open={activeModal === "report"} onClose={onClose} listing={listing} />
    </>
  );
}

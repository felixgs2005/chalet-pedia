import { useEffect, useState } from "react";
import ActionModal from "./ActionModal";
import ReviewModal from "./ReviewModal";

const CLAIM_PRICE = "87.00";

function ClaimModal({ open, onClose, claimPrice = CLAIM_PRICE }) {
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) setDetails("");
  }, [open]);

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Réclamer l'annonce"
      titleId="sd-modal-claim-title"
      renderBody={({ requestClose }) => (
      <>
      <p className="sd-action-modal__intro">
        Veuillez fournir des détails qui nous aiderons à vérifier que vous êtes le propriétaire de cette annonce.
      </p>
      <form
        className="sd-action-modal__form"
        onSubmit={(e) => {
          e.preventDefault();
          requestClose();
        }}
      >
        <div className="sd-action-modal__field">
          <label className="sd-action-modal__label" htmlFor="sd-claim-details">
            Détails
          </label>
          <textarea
            id="sd-claim-details"
            className="sd-action-modal__textarea"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={6}
          />
        </div>
        <button type="submit" className="sd-action-modal__submit">
          Réclamer pour {claimPrice}$
        </button>
      </form>
      </>
      )}
    />
  );
}

function ContactModal({ open, onClose }) {
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) {
      setMessage("");
      setFileName("");
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
        <form
          className="sd-action-modal__form"
          onSubmit={(e) => {
            e.preventDefault();
            if (sent) {
              requestClose();
              return;
            }
            setSent(true);
            window.setTimeout(() => requestClose(), 1600);
          }}
        >
          {sent && (
            <div className="sd-action-modal__success" role="status">
              Votre message a été envoyé.
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
              disabled={sent}
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
                disabled={sent}
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
              />
              {fileName || "Choisissez un fichier"}
            </label>
          </div>

          <button type="submit" className="sd-action-modal__submit" disabled={sent}>
            Contacter l&apos;annonceur
          </button>
        </form>
      )}
    />
  );
}

function ReportModal({ open, onClose }) {
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!open) setDetails("");
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
        onSubmit={(e) => {
          e.preventDefault();
          requestClose();
        }}
      >
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
          />
        </div>
        <button type="submit" className="sd-action-modal__submit">
          Signaler l&apos;annonce
        </button>
      </form>
      </>
      )}
    />
  );
}

/** Modales fiche service : contact, avis, réclamation, signalement. */
export default function ServiceListingModals({ activeModal, onClose, claimPrice, avisCible, onAvisSubmitted }) {
  return (
    <>
      <ContactModal open={activeModal === "contact"} onClose={onClose} />
      <ReviewModal
        open={activeModal === "review"}
        onClose={onClose}
        cible={avisCible}
        onSubmitted={onAvisSubmitted}
      />
      <ClaimModal open={activeModal === "claim"} onClose={onClose} claimPrice={claimPrice} />
      <ReportModal open={activeModal === "report"} onClose={onClose} />
    </>
  );
}

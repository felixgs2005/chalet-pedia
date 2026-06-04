import { useEffect, useState } from "react";
import ActionModal from "./ActionModal";
import ContactModal from "./ContactModal";
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
export default function ServiceListingModals({
  activeModal,
  onClose,
  claimPrice,
  avisCible,
  messageCible,
  onAvisSubmitted,
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
      <ClaimModal open={activeModal === "claim"} onClose={onClose} claimPrice={claimPrice} />
      <ReportModal open={activeModal === "report"} onClose={onClose} />
    </>
  );
}

import ActionModal from "./ActionModal";
import SubscriptionPrompt from "./SubscriptionPrompt";

/** Modale abonnement services — carte plan (style page Abonnements) + boutons Voir / Accueil. */
export default function ServiceSubscriptionModal({ open, onClose }) {
  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Inscrire vos services"
      titleId="service-subscription-modal-title"
      className="sd-action-modal--wide sd-action-modal--subscription"
      renderBody={() => (
        <SubscriptionPrompt
          plan="services"
          variant="card"
          showStatus
          onNavigate={onClose}
        />
      )}
    />
  );
}

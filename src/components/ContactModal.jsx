import { useEffect, useState } from "react";
import ActionModal from "./ActionModal";
import ContactFormFields from "./ContactFormFields";
import { useAuth } from "../context/AuthContext";
import { submitListingContactForm } from "../services/messagesFirestore";
import { resolveUtilisateur } from "../utils/resolveUtilisateur";

const EMPTY_FORM = {
  nom: "",
  email: "",
  telephone: "",
  message: "",
  consentement: false,
};

/** Modale « Contacter l'annonceur » — courriel au propriétaire via Nodemailer (Cloud Function). */
export default function ContactModal({ open, onClose, cible, onSent }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [destinataireLabel, setDestinataireLabel] = useState("");

  useEffect(() => {
    if (!open) {
      setFormData(EMPTY_FORM);
      setIsSubmitting(false);
      setSubmitStatus(null);
      setSubmitError("");
      setDestinataireLabel("");
      return;
    }

    let cancelled = false;

    (async () => {
      const next = { ...EMPTY_FORM };
      if (currentUser) {
        try {
          const profile = await resolveUtilisateur(currentUser);
          next.nom =
            `${profile.prenom || ""} ${profile.nom || ""}`.trim() ||
            profile.displayName ||
            "";
          next.email = profile.email || currentUser.email || "";
        } catch {
          next.email = currentUser.email || "";
          next.nom = currentUser.displayName || "";
        }
      }
      if (!cancelled) {
        setFormData(next);
        setDestinataireLabel(cible?.destinataireNom || "le propriétaire");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, currentUser, cible]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title=""
      titleId="sd-modal-contact-title"
      className="sd-action-modal--form sd-action-modal--contact-form"
      renderBody={({ requestClose }) => (
        <>
          <h2 className="contact-form-title">Envoyez-nous un message</h2>
          <p className="contact-form-desc">
            Votre message sera transmis directement à {destinataireLabel || "le propriétaire"} par
            courriel.
          </p>

          {submitError && (
            <div
              className="contact-success"
              style={{ borderColor: "#c0392b", background: "#fdecea" }}
            >
              <div className="contact-success-text">
                <strong>Erreur</strong>
                <p>{submitError}</p>
              </div>
            </div>
          )}

          {submitStatus === "success" && (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <div className="contact-success-text">
                <strong>Message envoyé !</strong>
                <p>
                  Votre message a été envoyé à {destinataireLabel || "le propriétaire"}. Merci pour
                  votre message.
                </p>
              </div>
            </div>
          )}

          <form
            className="contact-form"
            onSubmit={async (e) => {
              e.preventDefault();
              if (submitStatus === "success") {
                requestClose();
                return;
              }

              setIsSubmitting(true);
              setSubmitError("");
              setSubmitStatus(null);

              try {
                await submitListingContactForm(cible, formData);
                setSubmitStatus("success");
                onSent?.();
                window.setTimeout(() => requestClose(), 2400);
              } catch (err) {
                const msg = String(err?.message || "");
                setSubmitError(
                  msg.includes("permission") || msg.includes("Permission")
                    ? "Impossible d'enregistrer le message. Vérifiez que tous les champs obligatoires (dont le téléphone) sont remplis."
                    : msg || "Impossible d'envoyer le message. Réessayez plus tard."
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <ContactFormFields
              formData={formData}
              onChange={handleChange}
              idPrefix="sd-contact"
              showSujet={false}
              showTelephone
              disabled={isSubmitting || submitStatus === "success"}
            />

            <button
              type="submit"
              className="form-submit"
              disabled={
                isSubmitting || !formData.consentement || submitStatus === "success"
              }
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message →"}
            </button>
          </form>
        </>
      )}
    />
  );
}

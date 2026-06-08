export const CONTACT_SUJET_OPTIONS = [
  { value: "support", label: "Support technique" },
  { value: "proprietaire", label: "Annoncer un chalet" },
  { value: "partenariat", label: "Demande de partenariat" },
  { value: "publicite", label: "Publicité" },
  { value: "signalement", label: "Signalement d'annonce" },
  { value: "autre", label: "Autre" },
];

/** Champs du formulaire contact (page /contact/ et modale annonceur). */
export default function ContactFormFields({
  formData,
  onChange,
  idPrefix = "",
  disabled = false,
  showSujet = true,
  showTelephone = false,
}) {
  const pid = (name) => (idPrefix ? `${idPrefix}-${name}` : name);

  return (
    <>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor={pid("nom")} className="form-label">
            Nom complet *
          </label>
          <input
            type="text"
            id={pid("nom")}
            name="nom"
            value={formData.nom}
            onChange={onChange}
            required
            disabled={disabled}
            className="form-input"
            placeholder="Votre nom"
          />
        </div>
        <div className="form-group">
          <label htmlFor={pid("email")} className="form-label">
            Adresse email *
          </label>
          <input
            type="email"
            id={pid("email")}
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            disabled={disabled}
            className="form-input"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      {showSujet && (
        <div className="form-group">
          <label htmlFor={pid("sujet")} className="form-label">
            Sujet *
          </label>
          <select
            id={pid("sujet")}
            name="sujet"
            value={formData.sujet}
            onChange={onChange}
            required
            disabled={disabled}
            className="form-select"
          >
            {CONTACT_SUJET_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {showTelephone && (
        <div className="form-group">
          <label htmlFor={pid("telephone")} className="form-label">
            Numéro de téléphone *
          </label>
          <input
            type="tel"
            id={pid("telephone")}
            name="telephone"
            value={formData.telephone || ""}
            onChange={onChange}
            required
            disabled={disabled}
            className="form-input"
            placeholder="(514) 555-1234"
            autoComplete="tel"
          />
        </div>
      )}

      <div className="form-group">
        <label htmlFor={pid("message")} className="form-label">
          Message *
        </label>
        <textarea
          id={pid("message")}
          name="message"
          value={formData.message}
          onChange={onChange}
          required
          disabled={disabled}
          className="form-textarea"
          placeholder="Décrivez votre demande ou question..."
          rows={6}
        />
      </div>

      <div className="form-group">
        <label className="form-checkbox">
          <input
            type="checkbox"
            name="consentement"
            checked={formData.consentement}
            onChange={onChange}
            required
            disabled={disabled}
          />
          <span>
            J&apos;accepte que mes données soient traitées conformément à la politique de
            confidentialité de ChaletPedia. *
          </span>
        </label>
      </div>
    </>
  );
}

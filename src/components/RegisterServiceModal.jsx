import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ActionModal from "./ActionModal";
import ServicePhotoPicker from "./ServicePhotoPicker";
import { useAuth } from "../context/AuthContext";
import { buildServiceListingPayload, slugifyServiceTitle } from "../utils/buildServiceListingPayload";
import { submitServiceListing } from "../services/submitServiceListing";
import { uploadServiceListingImages } from "../services/uploadServiceListingImages";

const SERVICE_CATEGORIES = [
  { value: "construction", label: "Construction" },
  { value: "decoration", label: "Décoration" },
  { value: "entretien", label: "Entretien" },
  { value: "multimedia", label: "Multimédia" },
];

const EMPTY_FORM = {
  categorie: "",
  titre: "",
  slug: "",
  localisation: "",
  carte: "",
  numero: "",
  datePublication: "",
  descTitre: "",
  descParagraphe: "",
  services: [""],
  courriel: "",
  telephone: "",
  adresse: "",
};

function FormSection({ title, children, disabled }) {
  return (
    <fieldset className="sd-register-section" disabled={disabled}>
      <legend className="sd-register-section__title">{title}</legend>
      {children}
    </fieldset>
  );
}

function FieldLabel({ htmlFor, required, children }) {
  return (
    <label
      className={`sd-action-modal__label${required ? "" : " sd-action-modal__label--muted"}`}
      htmlFor={htmlFor}
    >
      {children}
      {required ? <span className="sd-register-required"> *</span> : null}
    </label>
  );
}

/** Formulaire d'inscription annonce service → Firestore annoncesService. */
export default function RegisterServiceModal({ open, onClose }) {
  const { currentUser, hasServicesSubscription } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [mainPhoto, setMainPhoto] = useState(null);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    if (!open) {
      setMainPhoto((prev) => {
        if (prev?.preview) URL.revokeObjectURL(prev.preview);
        return null;
      });
      setGalleryPhotos((prev) => {
        prev.forEach((p) => {
          if (p?.preview) URL.revokeObjectURL(p.preview);
        });
        return [];
      });
      setForm(EMPTY_FORM);
      setSlugTouched(false);
      setSent(false);
      setSubmitting(false);
      setError("");
    }
  }, [open]);

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "titre" && !slugTouched) {
        next.slug = slugifyServiceTitle(value);
      }
      return next;
    });
  };

  const updateService = (index, value) => {
    setForm((prev) => {
      const services = [...prev.services];
      services[index] = value;
      return { ...prev, services };
    });
  };

  const addService = () => {
    setForm((prev) => ({ ...prev, services: [...prev.services, ""] }));
  };

  const removeService = (index) => {
    setForm((prev) => {
      const services = prev.services.filter((_, i) => i !== index);
      return { ...prev, services: services.length ? services : [""] };
    });
  };

  const handleSubmit = async (e, requestClose) => {
    e.preventDefault();
    if (sent) {
      requestClose();
      return;
    }

    if (!currentUser?.uid) {
      setError("Vous devez être connecté pour publier une annonce.");
      return;
    }
    if (!hasServicesSubscription) {
      setError("Un abonnement services actif est requis pour publier.");
      return;
    }

    const services = form.services.map((s) => s.trim()).filter(Boolean);

    if (!form.categorie || !form.titre.trim() || !form.slug.trim()) {
      setError("La catégorie, le nom de l'annonce et l'identifiant de la fiche sont obligatoires.");
      return;
    }
    if (!form.courriel.trim() || !form.telephone.trim() || !form.adresse.trim()) {
      setError("Les coordonnées de contact sont obligatoires : courriel, téléphone et adresse.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      let imageUrls = [];
      if (mainPhoto?.file || galleryPhotos.length > 0) {
        imageUrls = await uploadServiceListingImages(form.categorie, form.slug.trim(), {
          mainFile: mainPhoto?.file ?? null,
          galleryFiles: galleryPhotos.map((p) => p.file),
        });
      }

      const payload = buildServiceListingPayload(
        { ...form, services },
        { imageUrls, proprietaireId: currentUser.uid }
      );
      await submitServiceListing(form.categorie, payload);
      setSent(true);
      window.setTimeout(() => requestClose(), 2200);
    } catch (err) {
      console.error(err);
      setError(
        err?.message ||
          "Impossible d'enregistrer l'annonce. Vérifiez votre connexion ou réessayez plus tard."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ActionModal
      open={open}
      onClose={onClose}
      title="Inscription au répertoire"
      titleId="sd-modal-register-title"
      className="sd-action-modal--wide sd-action-modal--form"
      renderBody={({ requestClose }) => {
        if (!currentUser) {
          return (
            <div className="sd-action-modal__intro">
              <p>Connectez-vous pour inscrire votre service.</p>
              <Link
                to="/auth"
                state={{ from: "/chalets/services/?inscrire=1" }}
                className="btn btn-primary"
                style={{ marginTop: 16, display: "inline-block" }}
                onClick={() => requestClose()}
              >
                Se connecter
              </Link>
            </div>
          );
        }

        return (
        <form
          className="sd-action-modal__form sd-register-form"
          onSubmit={(e) => handleSubmit(e, requestClose)}
        >
          {sent ? (
            <div className="sd-action-modal__success" role="status">
              Votre annonce a été soumise. Elle sera publiée après validation par notre équipe.
            </div>
          ) : (
            <p className="sd-action-modal__intro">
              Remplissez tous les champs ci-dessous. Votre fiche sera enregistrée dans le répertoire.
            </p>
          )}

          {error ? (
            <div className="sd-action-modal__error" role="alert">
              {error}
            </div>
          ) : null}

          <FormSection title="Informations sur l'annonce" disabled={sent || submitting}>
            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-categorie" required>
                Catégorie de services
              </FieldLabel>
              <select
                id="sd-register-categorie"
                className="sd-action-modal__input sd-action-modal__select"
                value={form.categorie}
                onChange={update("categorie")}
                disabled={sent || submitting}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {SERVICE_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-titre" required>
                Nom de l&apos;annonce
              </FieldLabel>
              <input
                id="sd-register-titre"
                type="text"
                className="sd-action-modal__input"
                value={form.titre}
                onChange={update("titre")}
                placeholder="Ex. : OVA Chalet Design — Design de chalets privés et locatifs"
                disabled={sent || submitting}
                required
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-slug" required>
                Identifiant de la fiche
              </FieldLabel>
              <input
                id="sd-register-slug"
                type="text"
                className="sd-action-modal__input"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug")(e);
                }}
                placeholder="ova-chalet-design"
                disabled={sent || submitting}
                required
              />
            </div>

            <div className="sd-action-modal__row">
              <div className="sd-action-modal__field">
                <FieldLabel htmlFor="sd-register-localisation">
                  Secteur desservi
                </FieldLabel>
                <input
                  id="sd-register-localisation"
                  type="text"
                  className="sd-action-modal__input"
                  value={form.localisation}
                  onChange={update("localisation")}
                  placeholder="Ex. : Québec, Québec, Canada"
                  disabled={sent || submitting}
                />
              </div>
              <div className="sd-action-modal__field">
                <FieldLabel htmlFor="sd-register-numero">
                  Numéro de référence
                </FieldLabel>
                <input
                  id="sd-register-numero"
                  type="text"
                  className="sd-action-modal__input"
                  value={form.numero}
                  onChange={update("numero")}
                  placeholder="2926"
                  disabled={sent || submitting}
                />
              </div>
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-carte">
                Libellé sur la carte
              </FieldLabel>
              <input
                id="sd-register-carte"
                type="text"
                className="sd-action-modal__input"
                value={form.carte}
                onChange={update("carte")}
                placeholder="Même adresse que la localisation si vide"
                disabled={sent || submitting}
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-date">
                Date de mise en ligne
              </FieldLabel>
              <input
                id="sd-register-date"
                type="text"
                className="sd-action-modal__input"
                value={form.datePublication}
                onChange={update("datePublication")}
                placeholder="Ex. : 16 mai 2025 (laissé vide = date du jour)"
                disabled={sent || submitting}
              />
            </div>

            <ServicePhotoPicker
              mainPhoto={mainPhoto}
              galleryPhotos={galleryPhotos}
              onMainPhotoChange={setMainPhoto}
              onGalleryChange={setGalleryPhotos}
              onError={setError}
              disabled={sent || submitting}
            />
          </FormSection>

          <FormSection title="Présentation de votre entreprise" disabled={sent || submitting}>
            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-desc-titre">
                Accroche
              </FieldLabel>
              <input
                id="sd-register-desc-titre"
                type="text"
                className="sd-action-modal__input"
                value={form.descTitre}
                onChange={update("descTitre")}
                placeholder="Ex. : Créons votre espace de rêve en pleine nature !"
                disabled={sent || submitting}
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-desc-p">
                Description
              </FieldLabel>
              <textarea
                id="sd-register-desc-p"
                className="sd-action-modal__textarea"
                value={form.descParagraphe}
                onChange={update("descParagraphe")}
                placeholder="Ex. : Notre équipe ponctuelle et professionnelle se spécialise en chalet locatif depuis bientôt deux ans. Nos services seront à la hauteur de vos attentes."
                rows={4}
                disabled={sent || submitting}
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel>Services offerts</FieldLabel>
              <p className="sd-register-hint">
                Ajoutez chaque service sur une ligne distincte. Ils apparaîtront sous forme de liste
                numérotée sur votre fiche publique.
              </p>
              <ul className="sd-register-list">
                {form.services.map((service, index) => (
                  <li key={index} className="sd-register-list__item">
                    <span className="sd-register-list__num" aria-hidden="true">
                      {index + 1}
                    </span>
                    <input
                      type="text"
                      className="sd-action-modal__input"
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      placeholder="Ex. : Entretien ménager chalet locatif"
                      disabled={sent || submitting}
                      aria-label={`Service ${index + 1}`}
                    />
                    {form.services.length > 1 ? (
                      <button
                        type="button"
                        className="sd-register-list__remove"
                        onClick={() => removeService(index)}
                        disabled={sent || submitting}
                        aria-label="Retirer ce service"
                      >
                        ×
                      </button>
                    ) : null}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="sd-register-list__add"
                onClick={addService}
                disabled={sent || submitting}
              >
                + Ajouter un service
              </button>
            </div>
          </FormSection>

          <FormSection title="Coordonnées de contact" disabled={sent || submitting}>
            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-courriel" required>
                Adresse courriel
              </FieldLabel>
              <input
                id="sd-register-courriel"
                type="email"
                className="sd-action-modal__input"
                value={form.courriel}
                onChange={update("courriel")}
                placeholder="contact@votreentreprise.com"
                disabled={sent || submitting}
                required
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-telephone" required>
                Numéro de téléphone
              </FieldLabel>
              <input
                id="sd-register-telephone"
                type="tel"
                className="sd-action-modal__input"
                value={form.telephone}
                onChange={update("telephone")}
                placeholder="(514) 000-0000"
                disabled={sent || submitting}
                required
              />
            </div>

            <div className="sd-action-modal__field">
              <FieldLabel htmlFor="sd-register-adresse" required>
                Adresse complète
              </FieldLabel>
              <input
                id="sd-register-adresse"
                type="text"
                className="sd-action-modal__input"
                value={form.adresse}
                onChange={update("adresse")}
                placeholder="Numéro civique, ville, province, code postal"
                disabled={sent || submitting}
                required
              />
            </div>
          </FormSection>

          <button
            type="submit"
            className="sd-action-modal__submit"
            disabled={sent || submitting}
          >
            {submitting
              ? mainPhoto?.file || galleryPhotos.length
                ? "Envoi des photos et de l'inscription…"
                : "Envoi en cours…"
              : "Soumettre l'inscription"}
          </button>
        </form>
        );
      }}
    />
  );
}

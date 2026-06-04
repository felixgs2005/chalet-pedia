import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SubmitListingRichText from "../../components/SubmitListingRichText";
import {
  buildChaletListingPayload,
  slugifyChaletTitle,
} from "../../utils/buildChaletListingPayload";
import { validateSubmitListingForm } from "../../utils/validateSubmitListingForm";
import {
  submitChaletListing,
  updateChaletListingImages,
} from "../../services/submitChaletListing";
import {
  uploadChaletListingImages,
  validateChaletImageFile,
} from "../../services/uploadChaletListingImages";
import { mapFirebaseError } from "../../utils/firebaseErrors";
import { promiseWithTimeout } from "../../utils/promiseWithTimeout";
import "../../styles/submit-listing.css";

const CATEGORIES = [
  { value: "chalets-louer", label: "Chalets à louer" },
  { value: "chalets-vendre", label: "Chalets à vendre" },
];

const MAX_PHOTOS = 30;

const EMPTY_FORM = {
  categorie: "chalets-louer",
  titre: "",
  slug: "",
  localisation: "",
  tags: "",
  description: "",
  tarification: "",
  citq: "",
  prixParNuit: "",
  prix: "",
  nombrePersonnes: "",
  nombreChambres: "",
  nombreSallesBain: "",
  videoUrl: "",
  lienBlog: "",
};

function createPhotoEntry(file) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
  };
}

function Req() {
  return <span className="req"> *</span>;
}

export default function SubmitListingDetails() {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p?.preview) URL.revokeObjectURL(p.preview);
      });
    };
  }, [photos]);

  const isVente = form.categorie === "chalets-vendre";
  const categoryLabel =
    CATEGORIES.find((c) => c.value === form.categorie)?.label || "";

  const update = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "titre" && !slugTouched) {
        next.slug = slugifyChaletTitle(value);
      }
      return next;
    });
  };

  const pickPhotos = (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_PHOTOS} photos.`);
      return;
    }

    const toAdd = files.slice(0, remaining);
    for (const file of toAdd) {
      const err = validateChaletImageFile(file);
      if (err) {
        setError(err);
        return;
      }
    }

    setPhotos((prev) => [...prev, ...toAdd.map(createPhotoEntry)]);
    setError("");
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((p) => p.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sent) return;

    if (!currentUser?.uid) {
      setError("Vous devez être connecté pour publier une annonce.");
      return;
    }

    const validation = validateSubmitListingForm(form, { photoCount: photos.length });
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    const slug = (form.slug || slugifyChaletTitle(form.titre)).trim();

    setSubmitting(true);
    setError("");

    try {
      const payload = buildChaletListingPayload(form, {
        imageUrls: [],
        proprietaireId: currentUser.uid,
      });

      await submitChaletListing(form.categorie, payload);

      const galleryFiles = photos.map((p) => p.file);
      if (galleryFiles.length > 0) {
        try {
          const imageUrls = await promiseWithTimeout(
            uploadChaletListingImages(form.categorie, slug, { galleryFiles }),
            180_000,
            "L'envoi des photos a pris trop de temps. Publiez storage.rules (Firebase → Storage → Rules) puis redémarrez npm start."
          );
          await updateChaletListingImages(form.categorie, slug, imageUrls);
        } catch (photoErr) {
          console.error(photoErr);
          setError(
            `Annonce enregistrée sous « ${slug} », mais les photos n'ont pas pu être envoyées : ${mapFirebaseError(photoErr)}`
          );
          setSent(true);
          return;
        }
      }

      setSent(true);
      photos.forEach((p) => {
        if (p?.preview) URL.revokeObjectURL(p.preview);
      });
      setPhotos([]);
    } catch (err) {
      console.error(err);
      setError(mapFirebaseError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSent(false);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    photos.forEach((p) => {
      if (p?.preview) URL.revokeObjectURL(p.preview);
    });
    setPhotos([]);
  };

  return (
    <div className="submit-listing-page">
      <div className="submit-listing-page__inner">
        <h1 className="submit-listing-page__title">Affichez une annonce</h1>
        <p className="submit-listing-page__intro">
          Tous les champs marqués d&apos;un astérisque sont obligatoires. Votre annonce sera
          enregistrée avec le statut <strong>En attente</strong> et publiée après validation.
        </p>

        {sent ? (
          <div className="submit-listing-alert submit-listing-alert--success">
            <strong>Annonce envoyée.</strong> Merci ! Nous examinerons votre fiche sous peu.
            Vous pouvez{" "}
            <Link to="/compte/reglages/" style={{ color: "#c5e0d4" }}>
              gérer votre compte
            </Link>{" "}
            ou soumettre une autre annonce.
          </div>
        ) : null}

        {error ? (
          <div className="submit-listing-alert submit-listing-alert--error" role="alert">
            {error}
          </div>
        ) : null}

        <form className="submit-listing-form" onSubmit={handleSubmit} noValidate>
          <div className="submit-listing-field">
            <span className="submit-listing-label">
              Catégorie<Req />
            </span>
            {categoryLabel ? (
              <span className="submit-listing-category-tag">{categoryLabel}</span>
            ) : null}
            <select
              id="listing-categorie"
              className="submit-listing-select"
              value={form.categorie}
              onChange={update("categorie")}
              disabled={sent || submitting}
              required
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="submit-listing-field">
            <span className="submit-listing-label">
              Galerie<Req />
            </span>
            <div className="submit-listing-file-row">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple
                className="submit-listing-file-input"
                onChange={pickPhotos}
                disabled={sent || submitting || photos.length >= MAX_PHOTOS}
                aria-hidden="true"
                tabIndex={-1}
              />
              <button
                type="button"
                className="submit-listing-file-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={sent || submitting || photos.length >= MAX_PHOTOS}
              >
                Choisissez des fichiers
              </button>
              <span className="submit-listing-file-count">
                JPG, PNG, WebP ou GIF — 5 Mo max. ({photos.length}/{MAX_PHOTOS})
              </span>
            </div>
            {photos.length > 0 ? (
              <ul className="submit-listing-gallery">
                {photos.map((photo) => (
                  <li key={photo.id} className="submit-listing-gallery__thumb">
                    <img src={photo.preview} alt="" />
                    <button
                      type="button"
                      className="submit-listing-gallery__remove"
                      onClick={() => removePhoto(photo.id)}
                      disabled={sent || submitting}
                      aria-label={`Retirer ${photo.name}`}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-titre">
              Titre<Req />
            </label>
            <input
              id="listing-titre"
              type="text"
              className="submit-listing-input"
              value={form.titre}
              onChange={update("titre")}
              disabled={sent || submitting}
              required
              placeholder="Nom de votre chalet"
            />
            {form.slug ? (
              <p className="submit-listing-slug">
                Adresse web : /chalet/{form.slug}
              </p>
            ) : null}
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-slug">
              Identifiant URL (slug)<Req />
            </label>
            <input
              id="listing-slug"
              type="text"
              className="submit-listing-input"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug")(e);
              }}
              disabled={sent || submitting}
              required
              placeholder="mon-chalet-mont-tremblant"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-localisation">
              Localisation<Req />
            </label>
            <p className="submit-listing-hint">
              Écrire la ville et la région ex : Mont-Tremblant, Laurentides
            </p>
            <input
              id="listing-localisation"
              type="text"
              className="submit-listing-input submit-listing-input--light"
              value={form.localisation}
              onChange={update("localisation")}
              disabled={sent || submitting}
              required
              placeholder="Ville, Région"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-tags">
              Tags<Req />
            </label>
            <p className="submit-listing-hint">
              Séparez les tags par des virgules (ex. : spa, bord de l&apos;eau, animaux).
            </p>
            <input
              id="listing-tags"
              type="text"
              className="submit-listing-input submit-listing-input--light"
              value={form.tags}
              onChange={update("tags")}
              disabled={sent || submitting}
              required
              placeholder="spa, ski, familial"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-description">
              Description<Req />
            </label>
            <textarea
              id="listing-description"
              className="submit-listing-textarea submit-listing-input--light"
              value={form.description}
              onChange={update("description")}
              disabled={sent || submitting}
              required
              placeholder="Rédigez une description"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-tarification">
              Tarification<Req />
            </label>
            <SubmitListingRichText
              id="listing-tarification"
              value={form.tarification}
              onChange={(html) => setForm((prev) => ({ ...prev, tarification: html }))}
              disabled={sent || submitting}
              placeholder="Décrivez vos tarifs, saisons, promotions…"
              aria-label="Tarification"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-citq">
              Numéro CITQ<Req />
            </label>
            <p className="submit-listing-hint">
              Entrez le numéro d&apos;enregistrement délivré par la Corporation de
              l&apos;industrie touristique du Québec (CITQ).
            </p>
            <input
              id="listing-citq"
              type="text"
              className="submit-listing-input submit-listing-input--light"
              value={form.citq}
              onChange={update("citq")}
              disabled={sent || submitting}
              required
              placeholder="Numéro d'enregistrement CITQ"
            />
          </div>

          {isVente ? (
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-prix">
                Prix demandé<Req />
              </label>
              <input
                id="listing-prix"
                type="text"
                className="submit-listing-input"
                value={form.prix}
                onChange={update("prix")}
                disabled={sent || submitting}
                required
                placeholder="Ex. : 450 000 $"
              />
            </div>
          ) : (
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-prix-nuit">
                Prix par nuit ($)<Req />
              </label>
              <input
                id="listing-prix-nuit"
                type="number"
                min="1"
                step="1"
                className="submit-listing-input"
                value={form.prixParNuit}
                onChange={update("prixParNuit")}
                disabled={sent || submitting}
                required
                placeholder="Ex. : 250"
              />
            </div>
          )}

          <div className="submit-listing-grid-3">
            {!isVente ? (
              <div className="submit-listing-field">
                <label className="submit-listing-label" htmlFor="listing-personnes">
                  Personnes<Req />
                </label>
                <input
                  id="listing-personnes"
                  type="number"
                  min="1"
                  className="submit-listing-input"
                  value={form.nombrePersonnes}
                  onChange={update("nombrePersonnes")}
                  disabled={sent || submitting}
                  required
                />
              </div>
            ) : null}
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-chambres">
                Chambres<Req />
              </label>
              <input
                id="listing-chambres"
                type="number"
                min="0"
                className="submit-listing-input"
                value={form.nombreChambres}
                onChange={update("nombreChambres")}
                disabled={sent || submitting}
                required
              />
            </div>
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-sdb">
                Salles de bain<Req />
              </label>
              <input
                id="listing-sdb"
                type="number"
                min="0"
                className="submit-listing-input"
                value={form.nombreSallesBain}
                onChange={update("nombreSallesBain")}
                disabled={sent || submitting}
                required
              />
            </div>
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label submit-listing-label--muted" htmlFor="listing-video">
              Vidéo (facultatif)
            </label>
            <p className="submit-listing-hint">
              Insérez une URL vers une vidéo promotionnelle ou informative liée à votre chalet.
              Assurez-vous qu&apos;elle est publique, de bonne qualité et pertinente.
            </p>
            <input
              id="listing-video"
              type="url"
              className="submit-listing-input"
              value={form.videoUrl}
              onChange={update("videoUrl")}
              disabled={sent || submitting}
              placeholder="Lien vers une vidéo"
            />
          </div>

          <div className="submit-listing-field">
            <label className="submit-listing-label submit-listing-label--muted" htmlFor="listing-blog">
              Article de blog (facultatif)
            </label>
            <p className="submit-listing-hint">
              Ajoutez le lien complet vers un article de blog pertinent en lien avec votre chalet.
              L&apos;article doit être informatif, bien structuré et rédigé dans un français de
              qualité. Exemples acceptés : blog personnel, ChaletPedia, médias spécialisés.
            </p>
            <input
              id="listing-blog"
              type="url"
              className="submit-listing-input"
              value={form.lienBlog}
              onChange={update("lienBlog")}
              disabled={sent || submitting}
              placeholder="Lien de l'article"
            />
          </div>

          <div className="submit-listing-actions">
            <button
              type="submit"
              className="submit-listing-submit"
              disabled={sent || submitting}
            >
              {submitting
                ? "Envoi en cours…"
                : sent
                  ? "Annonce envoyée"
                  : "Soumettre l'annonce →"}
            </button>
            {sent ? (
              <button
                type="button"
                className="submit-listing-file-btn"
                onClick={resetForm}
              >
                Nouvelle annonce
              </button>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

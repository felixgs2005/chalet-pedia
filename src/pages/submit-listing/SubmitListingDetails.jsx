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
  { value: "chalets-louer", label: "Chalets à louer", short: "À louer" },
  { value: "chalets-vendre", label: "Chalets à vendre", short: "À vendre" },
];

const CATEGORY_HINTS = {
  "chalets-louer":
    "Location courte durée — CITQ, prix par nuit, équipements et capacité d'accueil.",
  "chalets-vendre":
    "Vente immobilière — prix demandé, caractéristiques détaillées et description enrichie.",
};

const MAX_PHOTOS = 30;

function createCaracteristiqueBlock() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    titre: "",
    items: "",
  };
}

const EMPTY_FORM = {
  categorie: "chalets-louer",
  titre: "",
  sousTitre: "",
  slug: "",
  localisation: "",
  tags: "",
  equipements: "",
  description: "",
  descriptionTitre: "",
  tarification: "",
  citq: "",
  prixParNuit: "",
  prix: "",
  nombrePersonnes: "",
  nombreChambres: "",
  nombreSallesBain: "",
  nombreGarages: "",
  nombreEtages: "",
  caracteristiques: [createCaracteristiqueBlock()],
  siteWeb: "",
  videoUrl: "",
  lienBlog: "",
};

function createPhotoEntry(file, index = 0) {
  return {
    id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 9)}`,
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

  const updateCaracteristique = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      caracteristiques: prev.caracteristiques.map((block) =>
        block.id === id ? { ...block, [field]: value } : block
      ),
    }));
  };

  const addCaracteristique = () => {
    setForm((prev) => ({
      ...prev,
      caracteristiques: [...prev.caracteristiques, createCaracteristiqueBlock()],
    }));
  };

  const removeCaracteristique = (id) => {
    setForm((prev) => {
      if (prev.caracteristiques.length <= 1) return prev;
      return {
        ...prev,
        caracteristiques: prev.caracteristiques.filter((block) => block.id !== id),
      };
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

    const validFiles = [];
    let firstInvalidMessage = "";

    for (const file of files) {
      if (validFiles.length >= remaining) break;
      const err = validateChaletImageFile(file);
      if (err) {
        if (!firstInvalidMessage) firstInvalidMessage = err;
        continue;
      }
      validFiles.push(file);
    }

    if (!validFiles.length) {
      setError(firstInvalidMessage || "Aucune photo valide n'a pu être ajoutée.");
      return;
    }

    setPhotos((prev) => [
      ...prev,
      ...validFiles.map((file, index) => createPhotoEntry(file, index)),
    ]);

    const truncated = files.length > remaining;

    if (truncated && firstInvalidMessage) {
      setError(
        `${validFiles.length} photo(s) ajoutée(s). Limite de ${MAX_PHOTOS} atteinte ; certaines photos ont été ignorées (${firstInvalidMessage}).`
      );
    } else if (truncated) {
      setError(
        `${validFiles.length} photo(s) ajoutée(s). Seules les ${MAX_PHOTOS} premières photos sont conservées.`
      );
    } else if (firstInvalidMessage) {
      setError(
        `${validFiles.length} photo(s) ajoutée(s). Certaines photos ont été ignorées : ${firstInvalidMessage}`
      );
    } else {
      setError("");
    }
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
          <fieldset className="submit-listing-field submit-listing-category">
            <legend className="submit-listing-label">
              Catégorie<Req />
            </legend>
            <div className="submit-listing-category__options" role="presentation">
              {CATEGORIES.map((c) => {
                const isActive = form.categorie === c.value;
                return (
                  <label
                    key={c.value}
                    className={`submit-listing-category__option${isActive ? " is-active" : ""}`}
                  >
                    <input
                      type="radio"
                      name="listing-categorie"
                      className="submit-listing-category__input"
                      value={c.value}
                      checked={isActive}
                      onChange={update("categorie")}
                      disabled={sent || submitting}
                    />
                    <span className="submit-listing-category__short">{c.short}</span>
                    <span className="submit-listing-category__full">{c.label}</span>
                  </label>
                );
              })}
            </div>
            <p className="submit-listing-hint submit-listing-category__hint">
              {CATEGORY_HINTS[form.categorie]}
            </p>
          </fieldset>

          <div className="submit-listing-field">
            <span className="submit-listing-label">
              Galerie<Req />
            </span>
            <p className="submit-listing-hint">
              Ajoutez plusieurs photos de votre chalet en une seule fois ou par lots. La première
              photo servira de couverture sur la fiche.
            </p>
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
            <div className="submit-listing-file-row">
              <button
                type="button"
                className="submit-listing-file-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={sent || submitting || photos.length >= MAX_PHOTOS}
              >
                {photos.length > 0 ? "Ajouter d'autres photos" : "Choisir des photos"}
              </button>
              <span className="submit-listing-file-count">
                JPG, PNG, WebP ou GIF — 5 Mo max. — sélection multiple ({photos.length}/{MAX_PHOTOS})
              </span>
            </div>
            {photos.length > 0 ? (
              <>
                <p className="submit-listing-gallery__meta">
                  {photos.length} photo{photos.length > 1 ? "s" : ""}{" "}
                  {photos.length > 1 ? "sélectionnées" : "sélectionnée"}
                </p>
                <ul className="submit-listing-gallery">
                  {photos.map((photo, index) => (
                    <li key={photo.id} className="submit-listing-gallery__thumb">
                      <img src={photo.preview} alt="" />
                      {index === 0 ? (
                        <span className="submit-listing-gallery__cover">Couverture</span>
                      ) : (
                        <span className="submit-listing-gallery__index">{index + 1}</span>
                      )}
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
              </>
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
                Adresse web :{" "}
                {isVente
                  ? `/chalets/chalets-a-vendre/${form.slug}`
                  : `/chalet/${form.slug}`}
              </p>
            ) : null}
          </div>

          {!isVente ? (
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-sous-titre">
                Sous-titre<Req />
              </label>
              <p className="submit-listing-hint">
                Phrase d&apos;accroche affichée sous le nom (ex. : « Cabane vitrée avec spa et
                vue spectaculaire »).
              </p>
              <input
                id="listing-sous-titre"
                type="text"
                className="submit-listing-input submit-listing-input--light"
                value={form.sousTitre}
                onChange={update("sousTitre")}
                disabled={sent || submitting}
                required
                placeholder="Courte accroche de votre annonce"
              />
            </div>
          ) : null}

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

          {!isVente ? (
            <>
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
                <label className="submit-listing-label" htmlFor="listing-equipements">
                  Équipements et caractéristiques<Req />
                </label>
                <p className="submit-listing-hint">
                  Une entrée par ligne ou séparées par des virgules. Affichées sur la fiche avec une
                  coche (ex. : Spa extérieur, Foyer intérieur, Bord de l&apos;eau).
                </p>
                <textarea
                  id="listing-equipements"
                  className="submit-listing-textarea submit-listing-input--light"
                  value={form.equipements}
                  onChange={update("equipements")}
                  disabled={sent || submitting}
                  required
                  rows={5}
                  placeholder={"Spa extérieur\nFoyer intérieur\nBord de l'eau\nAnimaux permis"}
                />
              </div>
            </>
          ) : null}

          {isVente ? (
            <div className="submit-listing-field">
              <label className="submit-listing-label" htmlFor="listing-description-titre">
                Accroche de la description<Req />
              </label>
              <p className="submit-listing-hint">
                Une phrase d&apos;accroche affichée sous le titre sur la fiche (ex. : « Vivez le
                summum du confort moderne… »).
              </p>
              <input
                id="listing-description-titre"
                type="text"
                className="submit-listing-input submit-listing-input--light"
                value={form.descriptionTitre}
                onChange={update("descriptionTitre")}
                disabled={sent || submitting}
                required
                placeholder="Phrase d'accroche de votre annonce"
              />
            </div>
          ) : null}

          <div className="submit-listing-field">
            <label className="submit-listing-label" htmlFor="listing-description">
              Description<Req />
            </label>
            {isVente ? (
              <SubmitListingRichText
                id="listing-description"
                value={form.description}
                onChange={(html) => setForm((prev) => ({ ...prev, description: html }))}
                disabled={sent || submitting}
                placeholder="Décrivez votre propriété, son emplacement, ses atouts…"
                aria-label="Description"
              />
            ) : (
              <textarea
                id="listing-description"
                className="submit-listing-textarea submit-listing-input--light"
                value={form.description}
                onChange={update("description")}
                disabled={sent || submitting}
                required
                placeholder="Rédigez une description"
              />
            )}
          </div>

          {!isVente ? (
            <>
              <div className="submit-listing-field">
                <label
                  className="submit-listing-label submit-listing-label--muted"
                  htmlFor="listing-tarification"
                >
                  Tarification (facultatif)
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
            </>
          ) : null}

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
                placeholder="Ex. : 1 389 900 $"
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

          <div className={`submit-listing-grid-3${isVente ? " submit-listing-grid-4" : ""}`}>
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
            {isVente ? (
              <>
                <div className="submit-listing-field">
                  <label className="submit-listing-label" htmlFor="listing-garages">
                    Garages
                  </label>
                  <input
                    id="listing-garages"
                    type="number"
                    min="0"
                    className="submit-listing-input"
                    value={form.nombreGarages}
                    onChange={update("nombreGarages")}
                    disabled={sent || submitting}
                    placeholder="0"
                  />
                </div>
                <div className="submit-listing-field">
                  <label className="submit-listing-label" htmlFor="listing-etages">
                    Étages
                  </label>
                  <input
                    id="listing-etages"
                    type="number"
                    min="0"
                    className="submit-listing-input"
                    value={form.nombreEtages}
                    onChange={update("nombreEtages")}
                    disabled={sent || submitting}
                    placeholder="0"
                  />
                </div>
              </>
            ) : null}
          </div>

          {isVente ? (
            <div className="submit-listing-field">
              <span className="submit-listing-label">
                Caractéristiques<Req />
              </span>
              <p className="submit-listing-hint">
                Ajoutez des sections comme sur la fiche vente (ex. : « Une vue à couper le
                souffle »). Une ligne = un point dans la liste.
              </p>
              <div className="submit-listing-carac-list">
                {form.caracteristiques.map((block, index) => (
                  <div key={block.id} className="submit-listing-carac">
                    <div className="submit-listing-carac__head">
                      <span className="submit-listing-carac__num">
                        Section {String(index + 1).padStart(2, "0")}
                      </span>
                      {form.caracteristiques.length > 1 ? (
                        <button
                          type="button"
                          className="submit-listing-carac__remove"
                          onClick={() => removeCaracteristique(block.id)}
                          disabled={sent || submitting}
                        >
                          Retirer
                        </button>
                      ) : null}
                    </div>
                    <input
                      type="text"
                      className="submit-listing-input"
                      value={block.titre}
                      onChange={(e) =>
                        updateCaracteristique(block.id, "titre", e.target.value)
                      }
                      disabled={sent || submitting}
                      placeholder="Titre de la section (ex. : Cuisine digne d'un chef)"
                    />
                    <textarea
                      className="submit-listing-textarea submit-listing-input--light"
                      value={block.items}
                      onChange={(e) =>
                        updateCaracteristique(block.id, "items", e.target.value)
                      }
                      disabled={sent || submitting}
                      rows={4}
                      placeholder={"Un point par ligne\nComptoir en quartz\nCuisine sur mesure"}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="submit-listing-carac__add"
                onClick={addCaracteristique}
                disabled={sent || submitting}
              >
                + Ajouter une section
              </button>
            </div>
          ) : null}

          <div className="submit-listing-field">
            <label className="submit-listing-label submit-listing-label--muted" htmlFor="listing-site-web">
              Site web (facultatif)
            </label>
            <p className="submit-listing-hint">
              Lien vers votre site personnel, page de réservation ou vitrine du chalet.
            </p>
            <input
              id="listing-site-web"
              type="url"
              className="submit-listing-input"
              value={form.siteWeb}
              onChange={update("siteWeb")}
              disabled={sent || submitting}
              placeholder="https://www.monchalet.ca"
            />
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

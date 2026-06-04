import { useRef } from "react";
import { validateServiceImageFile } from "../services/uploadServiceListingImages";

const MAX_GALLERY = 10;

function createPhotoEntry(file) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    preview: URL.createObjectURL(file),
    name: file.name,
  };
}

/**
 * Sélection de la photo principale et de la galerie (aperçu local).
 */
export default function ServicePhotoPicker({
  mainPhoto,
  galleryPhotos,
  onMainPhotoChange,
  onGalleryChange,
  onError,
  disabled,
}) {
  const mainInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const pickMain = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const err = validateServiceImageFile(file);
    if (err) {
      onError?.(err);
      return;
    }
    if (mainPhoto?.preview) URL.revokeObjectURL(mainPhoto.preview);
    onMainPhotoChange(createPhotoEntry(file));
  };

  const pickGallery = (e) => {
    const files = [...(e.target.files || [])];
    e.target.value = "";
    if (!files.length) return;

    const remaining = MAX_GALLERY - galleryPhotos.length;
    if (remaining <= 0) {
      onError?.(`Maximum ${MAX_GALLERY} photos dans la galerie.`);
      return;
    }

    const toAdd = files.slice(0, remaining);
    const invalid = toAdd.find((f) => validateServiceImageFile(f));
    if (invalid) {
      const msg = validateServiceImageFile(invalid);
      onError?.(msg);
      return;
    }

    onGalleryChange([...galleryPhotos, ...toAdd.map(createPhotoEntry)]);
  };

  const removeMain = () => {
    if (mainPhoto?.preview) URL.revokeObjectURL(mainPhoto.preview);
    onMainPhotoChange(null);
  };

  const removeGallery = (id) => {
    const target = galleryPhotos.find((p) => p.id === id);
    if (target?.preview) URL.revokeObjectURL(target.preview);
    onGalleryChange(galleryPhotos.filter((p) => p.id !== id));
  };

  return (
    <div className="sd-photo-picker">
      <div className="sd-action-modal__field">
        <span className="sd-action-modal__label sd-action-modal__label--muted">Photo principale</span>
        <input
          ref={mainInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sd-action-modal__file-input"
          onChange={pickMain}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />
        {mainPhoto ? (
          <div className="sd-photo-preview sd-photo-preview--main">
            <img src={mainPhoto.preview} alt="Aperçu photo principale" />
            <div className="sd-photo-preview__meta">
              <span className="sd-photo-preview__name">{mainPhoto.name}</span>
              <button
                type="button"
                className="sd-photo-preview__remove"
                onClick={removeMain}
                disabled={disabled}
              >
                Retirer
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="sd-photo-picker__btn"
            onClick={() => mainInputRef.current?.click()}
            disabled={disabled}
          >
            + Ajouter une photo principale
          </button>
        )}
      </div>

      <div className="sd-action-modal__field">
        <span className="sd-action-modal__label sd-action-modal__label--muted">Galerie photos</span>
        <p className="sd-register-hint">
          JPG, PNG, WebP ou GIF — 5 Mo max. par fichier ({galleryPhotos.length}/{MAX_GALLERY}).
        </p>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="sd-action-modal__file-input"
          onChange={pickGallery}
          disabled={disabled}
          aria-hidden="true"
          tabIndex={-1}
        />
        {galleryPhotos.length > 0 ? (
          <ul className="sd-photo-gallery">
            {galleryPhotos.map((photo) => (
              <li key={photo.id} className="sd-photo-preview sd-photo-preview--thumb">
                <img src={photo.preview} alt="" />
                <button
                  type="button"
                  className="sd-photo-preview__remove sd-photo-preview__remove--icon"
                  onClick={() => removeGallery(photo.id)}
                  disabled={disabled}
                  aria-label={`Retirer ${photo.name}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
        {galleryPhotos.length < MAX_GALLERY ? (
          <button
            type="button"
            className="sd-photo-picker__btn sd-photo-picker__btn--secondary"
            onClick={() => galleryInputRef.current?.click()}
            disabled={disabled}
          >
            + Ajouter des photos à la galerie
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function revokePhotoEntries(mainPhoto, galleryPhotos = []) {
  if (mainPhoto?.preview) URL.revokeObjectURL(mainPhoto.preview);
  galleryPhotos.forEach((p) => {
    if (p?.preview) URL.revokeObjectURL(p.preview);
  });
}

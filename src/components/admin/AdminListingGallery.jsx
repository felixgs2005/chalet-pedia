import { useEffect, useState } from "react";
import { getAdminListingImages } from "../../utils/adminListingImages";

/** Galerie modale admin — vérifie le chargement (Storage 404) sans re-résoudre les URLs. */
export default function AdminListingGallery({ item }) {
  const [visible, setVisible] = useState([]);
  const [checked, setChecked] = useState(false);
  const candidates = getAdminListingImages(item);

  useEffect(() => {
    setVisible([]);
    setChecked(false);
    if (!item) return undefined;

    const urls = getAdminListingImages(item);
    if (!urls.length) {
      setChecked(true);
      return undefined;
    }

    let cancelled = false;
    const checks = urls.slice(0, 8).map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve(src);
          img.onerror = () => resolve(null);
          img.src = src;
        })
    );

    Promise.all(checks).then((results) => {
      if (!cancelled) {
        setVisible(results.filter(Boolean));
        setChecked(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!candidates.length) return null;
  if (!checked) return null;

  if (!visible.length) {
    return (
      <p className="admin-detail__gallery-empty">
        Photos enregistrées mais fichiers introuvables sur le stockage.
      </p>
    );
  }

  return (
    <div className="admin-detail__gallery">
      {visible.slice(0, 4).map((src, index) => (
        <img key={`${src}-${index}`} src={src} alt="" className="admin-detail__thumb" />
      ))}
    </div>
  );
}

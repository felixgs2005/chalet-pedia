// src/pages/ServiceDetail.jsx
// Page de détail d'une annonce de service (ex. OVA Chalet Design)
// Données : Firestore categorieServices / annoncesService
// Générique : /chalets/:categorie/:slug
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useServiceListingBySlug } from "../hooks/useServiceListingBySlug";
import ServiceDescriptionContent from "../components/ServiceDescriptionContent";
import { resolveServiceImages } from "../utils/serviceImages";
import { useSharePage } from "../hooks/useSharePage";
import ShareToast from "../components/ShareToast";
import ServiceListingModals from "../components/ServiceListingModals";

/** Animation au scroll — se réactive quand le contenu Firestore est monté. */
function useReveal(threshold = 0.12, ready = true) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ready) {
      setVisible(false);
      return undefined;
    }

    const node = ref.current;
    if (!node) return undefined;

    setVisible(false);

    const show = () => setVisible(true);
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "48px 0px" }
    );

    obs.observe(node);

    const raf = requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        show();
        obs.disconnect();
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      obs.disconnect();
    };
  }, [threshold, ready]);

  return [ref, visible];
}

const IconBasket = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);
const IconPencil = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconClaim = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
const IconFlag = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

export default function ServiceDetail() {
  const { categorie, slug } = useParams();
  const { listing, loading, error } = useServiceListingBySlug(categorie, slug);
  const { share, feedback: shareFeedback } = useSharePage();
  const [activeImg, setActiveImg] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const contentReady = Boolean(listing);
  const [mapRef, mapVisible] = useReveal(0.12, contentReady);

  if (loading) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center", color: "#4A4A48" }}>
        Chargement de l&apos;annonce…
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger l&apos;annonce
        </h1>
        <p style={{ color: "#4A4A48" }}>{error.message || "Une erreur est survenue."}</p>
      </div>
    );
  }

  if (!listing) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR 404</div>
        <h1 className="section-title" style={{ fontSize: 48, marginTop: 12, marginBottom: 20 }}>
          Annonce introuvable
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>
          Cette annonce n'existe pas ou a été retirée.
        </p>
        <Link to={`/chalets/${categorie}/`} className="btn-annoncer">
          ← Retour à la catégorie
        </Link>
      </div>
    );
  }

  const images = resolveServiceImages(listing);
  const singleImage = images.length < 2;

  const handleShare = () => {
    share({
      title: listing.titre,
      text: `${listing.categorieNom} · ${listing.localisation}`,
    });
  };

  const openModal = (id) => setActiveModal(id);
  const closeModal = () => setActiveModal(null);
  const linkClass = (id) =>
    `sd-link-action${activeModal === id ? " is-open" : ""}${id === "report" ? " sd-link-action--danger" : ""}`;

  return (
    <div className="service-detail-page">
      <ShareToast message={shareFeedback} />
      <ServiceListingModals activeModal={activeModal} onClose={closeModal} />
      {/* FIL D'ARIANE */}
      <nav className="breadcrumb sd-reveal">
        <Link to="/">Accueil</Link>
        <span className="separator"> / </span>
        <Link to="/chalets/services/">Services</Link>
        <span className="separator"> / </span>
        <Link to={`/chalets/${listing.categorieSlug}/`}>{listing.categorieNom}</Link>
        <span className="separator"> / </span>
        <span style={{ color: "#1A1A1A" }}>{listing.titre}</span>
      </nav>

      {/* EN-TÊTE */}
      <div className="chalet-header sd-reveal sd-reveal--d1">
        <div className="chalet-header-left">
          <div className="badge-region">{listing.categorieNom}</div>
          <h1 className="chalet-title">{listing.titre}</h1>
          <div className="chalet-location-big">📍 {listing.localisation}</div>
          {listing.date && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#4A4A48" }}>
              Ajouté le {listing.date}
            </div>
          )}
        </div>
        <div className="chalet-actions">
          <button className="action-btn">♡ Ajouter aux favoris</button>
          <button type="button" className="action-btn" onClick={handleShare}>
            ↗ Partager
          </button>
        </div>
      </div>

      {/* GALERIE */}
      <div
        className={`gallery sd-reveal sd-reveal--d2${singleImage ? " service-gallery--hero" : " service-gallery--grid"}`}
        onClick={() => setGalleryOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setGalleryOpen(true);
          }
        }}
        aria-label="Ouvrir la galerie photos"
      >
        {images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={`gallery-img${i === 0 ? " main" : ""}`}
          >
            <img
              className="gallery-img__photo"
              src={img}
              alt={`${listing.titre} — photo ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
            />
            {i === 3 && images.length >= 4 && (
              <div className="gallery-more">📷 Voir toutes les photos</div>
            )}
          </div>
        ))}
      </div>

      {/* MODALE GALERIE */}
      {galleryOpen && (
        <div
          onClick={() => setGalleryOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 999,
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          }}
        >
          <button
            style={{ position: "absolute", top: 20, right: 24, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}
            onClick={() => setGalleryOpen(false)}
          >✕</button>
          <img
            src={images[activeImg]}
            alt={listing.titre}
            style={{ maxHeight: "80vh", maxWidth: "90vw", objectFit: "contain", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <div style={{ display: "flex", gap: 10, marginTop: 18 }} onClick={(e) => e.stopPropagation()}>
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  onClick={() => setActiveImg(i)}
                  style={{
                    width: 64, height: 48, objectFit: "cover", borderRadius: 6, cursor: "pointer",
                    border: i === activeImg ? "2px solid #7FA890" : "2px solid transparent",
                    opacity: i === activeImg ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          )}
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontSize: 13 }}>
            {activeImg + 1} / {images.length}
          </p>
        </div>
      )}

      {/* CORPS */}
      <div className="body-grid">
        {/* COLONNE GAUCHE */}
        <div className="sd-reveal sd-reveal--d2">
          <div className="info-block">
            <div className="info-label">À propos de cette annonce</div>
            <h2 className="info-title">{listing.titre}</h2>
            {listing.numero ? (
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#9A9A98", marginBottom: 4, padding: "6px 12px", background: "#FAFAF6", borderRadius: 6, display: "inline-block" }}>
                Annonce <strong style={{ color: "#0F0F0F" }}>#{listing.numero}</strong>
              </div>
            ) : null}
          </div>

          <div className="info-block">
            <div className="info-label">Description</div>
            <ServiceDescriptionContent listing={listing} />
          </div>
        </div>

        {/* COLONNE DROITE — CARTE CONTACT */}
        <div>
          <div className="sd-contact-card sd-reveal sd-reveal--d3">
            <div className="sd-contact-card__header">
              <div className="sd-contact-card__kicker">
                {listing.categorieNom} · Québec
              </div>
              <div className="sd-contact-card__price">Sur demande</div>
              <div className="sd-contact-card__sub">
                Tarif communiqué par le prestataire
              </div>
            </div>

            <div className="sd-contact-card__body">
              <div className="sd-contact-card__note">
                <span className="sd-contact-card__check">✓</span>
                Contact direct avec le prestataire
              </div>

              <button type="button" className="sd-btn sd-btn--primary sd-btn--with-icon">
                <IconBasket />
                Magasiner le catalogue
              </button>

              <button
                type="button"
                className={`sd-btn sd-btn--primary${activeModal === "contact" ? " is-pressed" : ""}`}
                onClick={() => openModal("contact")}
              >
                Contacter l&apos;annonceur
              </button>

              <div className="sd-contact-card__divider" />

              <div className="sd-contact-card__links">
                <button type="button" className={linkClass("review")} onClick={() => openModal("review")}>
                  <IconPencil /> Rédiger un avis
                </button>
                <button type="button" className={linkClass("claim")} onClick={() => openModal("claim")}>
                  <IconClaim /> Réclamer l&apos;annonce
                </button>
                <button type="button" className={linkClass("report")} onClick={() => openModal("report")}>
                  <IconFlag /> Signaler l&apos;annonce
                </button>
              </div>

              <Link
                to={`/chalets/${listing.categorieSlug}/`}
                className="sd-contact-card__back"
              >
                ← Voir les autres annonces
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CARTE */}
      <div
        ref={mapRef}
        className={`map-placeholder sd-scroll-reveal${mapVisible ? " is-visible" : ""}`}
      >
        <div className="info-label" style={{ marginBottom: 14 }}>Carte</div>
        <div className="map-frame sd-map">
          <iframe
            title={`Carte — ${listing.titre}`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              listing.carte || listing.localisation
            )}&z=10&hl=fr&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div style={{ marginTop: 10, fontSize: 13, color: "#9A9A98" }}>
          📍 {listing.localisation}
        </div>
      </div>
    </div>
  );
}

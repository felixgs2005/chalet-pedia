// src/pages/ServiceDetail.jsx
// Page de détail d'une annonce de service (ex. OVA Chalet Design)
// Reprend la disposition / le style de ChaletPage.jsx, avec une carte
// de contact retravaillée + animations (classes "sd-*" maison).
// Générique : /chalets/:categorie/:slug
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getListing } from "../data/services";

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

const IconPencil = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);
const IconTag = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41 13.42 20.6a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
    <circle cx="7" cy="7" r="1.2" />
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
  const listing = getListing(categorie, slug);
  const [activeImg, setActiveImg] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [descRef, descVisible] = useReveal();
  const [mapRef, mapVisible] = useReveal();

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

  const images =
    Array.isArray(listing.images) && listing.images.length > 0
      ? listing.images
      : [listing.image];
  const singleImage = images.length < 2;

  return (
    <div className="service-detail-page">
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
          <button className="action-btn">↗ Partager</button>
        </div>
      </div>

      {/* GALERIE */}
      <div
        className="gallery sd-reveal sd-reveal--d2"
        onClick={() => setGalleryOpen(true)}
        style={
          singleImage
            ? { gridTemplateColumns: "1fr", gridTemplateRows: "420px", cursor: "pointer" }
            : { cursor: "pointer" }
        }
      >
        {images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={`gallery-img${i === 0 ? " main" : ""}`}
            style={{ backgroundImage: `url('${img}')` }}
          >
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
            {listing.numero != null && (
              <div style={{ fontFamily: "monospace", fontSize: 11, color: "#9A9A98", marginBottom: 4, padding: "6px 12px", background: "#FAFAF6", borderRadius: 6, display: "inline-block" }}>
                Annonce <strong style={{ color: "#0F0F0F" }}>#{listing.numero}</strong>
              </div>
            )}
          </div>

          <div
            ref={descRef}
            className={`info-block sd-scroll-reveal${descVisible ? " is-visible" : ""}`}
          >
            <div className="info-label">Description</div>
            {Array.isArray(listing.description) ? (
              listing.description.map((block, i) => {
                if (block.h) {
                  return (
                    <h3 className="sd-desc-h" key={i}>
                      {block.h}
                    </h3>
                  );
                }
                if (block.ul) {
                  return (
                    <ul className="sd-desc-list" key={i}>
                      {block.ul.map((item, j) => (
                        <li key={j} style={{ "--j": j }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p
                    className="info-text"
                    key={i}
                    style={block.bold ? { fontWeight: 700, color: "#0F0F0F" } : undefined}
                  >
                    {block.p}
                  </p>
                );
              })
            ) : (
              <>
                {listing.accroche && (
                  <p className="info-text" style={{ fontWeight: 700, color: "#0F0F0F" }}>
                    {listing.accroche}
                  </p>
                )}
                {listing.intro && <p className="info-text">{listing.intro}</p>}
                {Array.isArray(listing.services) && listing.services.length > 0 && (
                  <>
                    <div className="info-label" style={{ marginTop: 18 }}>Services</div>
                    <div className="sd-services">
                      {listing.services.map((s, i) => (
                        <div className="sd-service" key={i} style={{ "--i": i }}>
                          <span className="sd-service__num">{i + 1}</span>
                          <span className="sd-service__text">{s}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
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

              <button className="sd-btn sd-btn--primary">
                Magasiner le catalogue <span aria-hidden="true">→</span>
              </button>
              <button className="sd-btn sd-btn--ghost">Contacter l'annonceur</button>

              <div className="sd-contact-card__divider" />

              <div className="sd-contact-card__links">
                <button className="sd-link-action">
                  <IconPencil /> Rédiger un avis
                </button>
                <button className="sd-link-action">
                  <IconTag /> Réclamer l'annonce
                </button>
                <button className="sd-link-action sd-link-action--danger">
                  <IconFlag /> Signaler l'annonce
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

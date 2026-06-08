// src/pages/ChaletPage.jsx
// ============================================================
// PAGE DYNAMIQUE CHALET
// Données chargées depuis Firestore (collection chalets).
// ============================================================

import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useChaletBySlug } from "../hooks/useChaletBySlug";
import { useChalets } from "../hooks/useChalets";
import { useAvis } from "../hooks/useAvis";
import ChaletCard from "../components/ChaletCard";
import AvisList from "../components/AvisList";
import ReviewModal from "../components/ReviewModal";
import { useSharePage } from "../hooks/useSharePage";
import ShareToast from "../components/ShareToast";
import { buildChaletAvisCible } from "../services/avisFirestore";
import { buildChaletFavoriCible } from "../services/favorisFirestore";
import { buildChaletMessageCible } from "../services/messagesFirestore";
import ContactModal from "../components/ContactModal";
import FavoriteButton from "../components/FavoriteButton";

export default function ChaletPage() {
  const { slug } = useParams();
  const { chalet, loading, error } = useChaletBySlug(slug);
  const { chalets } = useChalets();
  const { avis, loading: avisLoading, refresh: refreshAvis } = useAvis("chalet", chalet?.slug);
  const { share, feedback: shareFeedback } = useSharePage();
  const [activeImg, setActiveImg] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  const similaires = useMemo(
    () =>
      chalet
        ? chalets.filter((c) => c.id !== chalet.id && c.region === chalet.region).slice(0, 3)
        : [],
    [chalet, chalets]
  );

  if (loading) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">CHALET</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement de l'annonce…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger le chalet
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>{error.message || "Une erreur est survenue."}</p>
        <Link to="/chalets/chalet-a-louer/" className="btn-annoncer">← Retour aux chalets à louer</Link>
      </div>
    );
  }

  if (!chalet) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR 404</div>
        <h1 className="section-title" style={{ fontSize: 48, marginTop: 12, marginBottom: 20 }}>
          Chalet introuvable
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>
          Ce chalet n'existe pas ou a été retiré.
        </p>
        <Link to="/" className="btn-annoncer">← Retour à l'accueil</Link>
      </div>
    );
  }

  const handleShare = () => {
    share({
      title: chalet.nom,
      text: `${chalet.regionLabel || chalet.region} · ${chalet.localisation}`,
    });
  };

  const avisCible = buildChaletAvisCible(chalet);
  const favoriCible = buildChaletFavoriCible(chalet);
  const messageCible = buildChaletMessageCible(chalet);
  const noteMoyenne =
    avis.length > 0
      ? Math.round((avis.reduce((s, a) => s + a.note, 0) / avis.length) * 10) / 10
      : chalet.note;
  const nbAvis = avis.length > 0 ? avis.length : (chalet.nbAvis ?? 0);

  return (
    <div>
      <ShareToast message={shareFeedback} />
      <ReviewModal
        open={reviewOpen}
        onClose={() => setReviewOpen(false)}
        cible={avisCible}
        onSubmitted={refreshAvis}
      />
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        cible={messageCible}
      />
      {/* FIL D'ARIANE */}
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator"> / </span>
        <Link to="/chalets/chalet-a-louer/">Chalets à louer</Link>
        <span className="separator"> / </span>
        <span>{chalet.region}</span>
        <span className="separator"> / </span>
        <span style={{ color: "#1A1A1A" }}>{chalet.nom}</span>
      </nav>

      {/* EN-TÊTE */}
      <div className="chalet-header">
        <div className="chalet-header-left">
          <div className="badge-region">{chalet.regionLabel}</div>
          <h1 className="chalet-title">{chalet.nom}</h1>
          {chalet.sousTitre && (
            <p style={{ fontSize: 16, color: "#4A4A48", marginBottom: 8 }}>{chalet.sousTitre}</p>
          )}
          <div className="chalet-location-big">📍 {chalet.localisation}</div>
          {nbAvis > 0 && noteMoyenne && (
            <div style={{ marginTop: 8, fontSize: 13, color: "#4A4A48", display: "flex", alignItems: "center", gap: 6 }}>
              ⭐ {noteMoyenne.toFixed(1)} ({nbAvis} avis)
            </div>
          )}
        </div>
        <div className="chalet-actions">
          <FavoriteButton cible={favoriCible} className="action-btn" />
          <button type="button" className="action-btn" onClick={handleShare}>
            ↗ Partager
          </button>
        </div>
      </div>

      {/* GALERIE */}
      <div className="gallery" onClick={() => setGalleryOpen(true)} style={{ cursor: "pointer" }}>
        {chalet.images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={`gallery-img${i === 0 ? " main" : ""}`}
            style={{ backgroundImage: `url('${img}')` }}
          >
            {i === 3 && chalet.images.length > 4 && (
              <div className="gallery-more">📷 +{chalet.images.length - 4} photos</div>
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
            src={chalet.images[activeImg]}
            alt={chalet.nom}
            style={{ maxHeight: "80vh", maxWidth: "90vw", objectFit: "contain", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 18 }} onClick={(e) => e.stopPropagation()}>
            {chalet.images.map((img, i) => (
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
          <p style={{ color: "rgba(255,255,255,0.6)", marginTop: 12, fontSize: 13 }}>
            {activeImg + 1} / {chalet.images.length}
          </p>
        </div>
      )}

      {/* CORPS */}
      <div className="body-grid">
        {/* COLONNE GAUCHE */}
        <div>
          <div className="info-block">
            <div className="info-label">À propos de ce chalet</div>
            <h2 className="info-title">{chalet.nom}</h2>
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#9A9A98", marginBottom: 16, padding: "6px 12px", background: "#FAFAF6", borderRadius: 6, display: "inline-block" }}>
              Annonce <strong style={{ color: "#0F0F0F" }}>#{chalet.citq || "—"}</strong>
            </div>
            <div className="info-stats">
              <div className="info-stat">
                <div className="info-stat-num">{chalet.invites}</div>
                <div className="info-stat-label">Invités</div>
              </div>
              {chalet.chambres != null && (
                <div className="info-stat">
                  <div className="info-stat-num">{chalet.chambres}</div>
                  <div className="info-stat-label">Chambre{chalet.chambres > 1 ? "s" : ""}</div>
                </div>
              )}
              {chalet.sdb != null && (
                <div className="info-stat">
                  <div className="info-stat-num">{chalet.sdb}</div>
                  <div className="info-stat-label">Salle{chalet.sdb > 1 ? "s" : ""} de bain</div>
                </div>
              )}
              <div className="info-stat">
                <div className="info-stat-num">{chalet.prixNuit ? `${chalet.prixNuit}$` : "—"}</div>
                <div className="info-stat-label">/ nuit</div>
              </div>
            </div>
          </div>

          <div className="info-block">
            <div className="info-label">Description</div>
            <p className="info-text">{chalet.description}</p>
            {chalet.descriptionEn && (
              <p className="info-text" style={{ color: "#6A6A68", fontSize: 13, fontStyle: "italic" }}>
                {chalet.descriptionEn}
              </p>
            )}
          </div>

          {chalet.caracteristiques && (
            <div className="info-block">
              <div className="info-label">Équipements & caractéristiques</div>
              <div className="caracteristiques-grid">
                {chalet.caracteristiques.map((car) => (
                  <span className="caracteristique" key={car}>✓ {car}</span>
                ))}
              </div>
            </div>
          )}

          {chalet.citq && (
            <div className="info-block">
              <div className="info-label">Conformité & réglementation</div>
              <div className="citq">
                <div className="citq-label">Numéro CITQ</div>
                <div className="citq-num">{chalet.citq}</div>
                <p className="citq-explain">
                  Ce chalet est enregistré auprès de la Corporation de l'industrie touristique du Québec (CITQ), conformément à la Loi sur les établissements d'hébergement touristique.
                </p>
              </div>
            </div>
          )}

          <AvisList
            avis={avis}
            loading={avisLoading}
            onWriteReview={() => setReviewOpen(true)}
          />
        </div>

        {/* COLONNE DROITE — RÉSERVATION */}
        <div>
          <div className="booking-card">
            <div className="booking-from">À partir de</div>
            <div className="booking-price">
              <span className="booking-price-num">
                {chalet.prixNuit ? `${chalet.prixNuit}$` : "Prix sur demande"}
              </span>
              {chalet.prixNuit && <span className="booking-price-unit">/ nuit</span>}
            </div>
            <div className="booking-commission">✓ 0 % de commission — prix direct propriétaire</div>

            <div style={{ background: "#FAFAF6", border: "1px solid rgba(15,15,15,0.08)", borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.22em", color: "#1F4D3A", textTransform: "uppercase", marginBottom: 10 }}>
                Tarification
              </div>
              {[
                { lang: "FR", bg: "#1F4D3A", label: "Consulter les disponibilités" },
                { lang: "EN", bg: "#4A4A48", label: "Check availability" },
              ].map((item) => (
                <a
                  key={item.lang}
                  href="#contact"
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 8px", borderRadius: 8, textDecoration: "none", color: "#1A1A1A", fontSize: 13, fontWeight: 500 }}
                >
                  <span style={{ background: item.bg, color: "#fff", fontFamily: "'Archivo Black', sans-serif", fontSize: 10, padding: "3px 6px", borderRadius: 4, minWidth: 26, textAlign: "center" }}>
                    {item.lang}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 12, color: "#1F4D3A", fontWeight: 700 }}>↗</span>
                </a>
              ))}
            </div>

            <button
              type="button"
              className="booking-cta"
              onClick={() => setContactOpen(true)}
            >
              Contacter le propriétaire
            </button>
            <button type="button" className="booking-secondary">Vérifier les disponibilités</button>
            <button
              type="button"
              className="booking-secondary"
              onClick={() => setReviewOpen(true)}
            >
              Rédiger un avis
            </button>

            <div className="booking-divider" />

            <div className="booking-owner">
              <div className="owner-avatar">{chalet.proprietaire.initiales}</div>
              <div>
                <div className="owner-name">{chalet.proprietaire.nom}</div>
                <div className="owner-meta">{chalet.proprietaire.membre}</div>
              </div>
            </div>
            <div style={{ marginTop: 14, fontSize: 12, color: "#9A9A98", textAlign: "center", lineHeight: 1.5 }}>
              Aucune commission · Paiement direct au propriétaire
            </div>
          </div>
        </div>
      </div>

      {/* CARTE */}
      <div className="map-placeholder">
        <div className="info-label" style={{ marginBottom: 14 }}>Localisation</div>
        {chalet.localisation ? (
          <>
            <div className="map-frame">
              <iframe
                title={`Carte de la région — ${chalet.nom}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(chalet.localisation)}&z=10&hl=fr&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: 10, fontSize: 13, color: "#9A9A98" }}>
              📍 {chalet.localisation} · Coordonnées exactes communiquées par le propriétaire
            </div>
          </>
        ) : (
          <div className="map-box">
            <div className="map-pin">📍</div>
            <div className="map-label">Québec</div>
            <div className="map-sub">Coordonnées exactes communiquées par le propriétaire</div>
          </div>
        )}
      </div>

      {/* CHALETS SIMILAIRES */}
      {similaires.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <div className="kicker">DANS LA MÊME RÉGION</div>
              <h2 className="section-title">Chalets similaires</h2>
            </div>
            <Link to="/chalets/chalet-a-louer/" className="section-link">Voir tout →</Link>
          </div>
          <div className="chalets-grid">
            {similaires.map((c) => (
              <ChaletCard key={c.id} chalet={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

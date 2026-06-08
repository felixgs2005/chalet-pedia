// src/pages/VentePage.jsx
// ============================================================
// FICHE CHALET À VENDRE — DYNAMIQUE
// S'adapte au slug de l'URL (/chalets/chalets-a-vendre/:slug)
// Données chargées depuis Firestore (collection ventes).
// ============================================================

import { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useVenteBySlug } from "../hooks/useVenteBySlug";
import { PinIcon, CameraIcon } from "../components/Icons";
import { useSharePage } from "../hooks/useSharePage";
import ShareToast from "../components/ShareToast";
import FavoriteButton from "../components/FavoriteButton";
import ContactModal from "../components/ContactModal";
import { useAuth } from "../context/AuthContext";
import { buildVenteFavoriCible } from "../services/favorisFirestore";
import { buildVenteMessageCible } from "../services/messagesFirestore";

export default function VentePage() {
  const { slug } = useParams();
  const { vente, loading, error } = useVenteBySlug(slug);
  const { share, feedback: shareFeedback } = useSharePage();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [contactOpen, setContactOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingInvites, setBookingInvites] = useState(1);

  const handleOrganizeClick = () => {
    if (!currentUser) {
      navigate('/auth', { state: { from: location } });
    } else {
      setBookingOpen(true);
    }
  };

  const handleBookingSubmit = () => {
    if (!bookingDate) {
      alert('Veuillez sélectionner une date de visite.');
      return;
    }
    if (bookingInvites < 1) {
      alert('Le nombre d\'invités doit être au moins 1.');
      return;
    }
    navigate('/reservation/confirmer', {
      state: {
        chaletSlug: vente.slug || slug,
        chaletId: vente.id,
        returnPath: `/chalets/chalets-a-vendre/${vente.slug || slug}`,
        dateVisite: bookingDate,
        nbInvites: bookingInvites,
      },
    });
    setBookingOpen(false);
  };

  if (loading) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">CHALET À VENDRE</div>
        <p style={{ marginTop: 12, color: "#4A4A48" }}>Chargement de l'annonce…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR</div>
        <h1 className="section-title" style={{ fontSize: 36, marginTop: 12, marginBottom: 16 }}>
          Impossible de charger l'annonce
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>{error.message || "Une erreur est survenue."}</p>
        <Link to="/chalets/chalets-a-vendre/" className="btn-annoncer">
          ← Retour aux chalets à vendre
        </Link>
      </div>
    );
  }

  if (!vente) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <div className="kicker">ERREUR 404</div>
        <h1 className="section-title" style={{ fontSize: 48, marginTop: 12, marginBottom: 20 }}>
          Propriété introuvable
        </h1>
        <p style={{ color: "#4A4A48", marginBottom: 32 }}>
          Cette propriété n'existe pas ou a été retirée.
        </p>
        <Link to="/chalets/chalets-a-vendre/" className="btn-annoncer">
          ← Retour aux chalets à vendre
        </Link>
      </div>
    );
  }

  const stats = [
    { num: vente.chambres, label: "Chambres" },
    { num: vente.sdb, label: "Salles de bain" },
    { num: vente.garages, label: "Garages" },
    { num: vente.etages, label: "Étages" },
  ];

  const handleShare = () => {
    share({
      title: vente.titre || vente.nom,
      text: `${vente.regionBadge || ""} · ${vente.localisation}`,
    });
  };

  const favoriCible = buildVenteFavoriCible(vente);
  const messageCible = buildVenteMessageCible(vente);

  return (
    <div className="vente-detail">
      <ShareToast message={shareFeedback} />
      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        cible={messageCible}
      />
      <nav className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span className="separator">›</span>
        <Link to="/chalets/chalets-a-vendre/">Chalets à vendre</Link>
        <span className="separator">›</span>
        <span style={{ color: "#1A1A1A" }}>{vente.nom}</span>
      </nav>

      <div className="listing-header">
        <div>
          <div className="badge-vente">{vente.regionBadge} · À VENDRE</div>
          <h1 className="listing-title">{vente.titre}</h1>
          <div className="listing-location">
            <PinIcon /> {vente.localisation}
          </div>
        </div>
        <div className="listing-actions">
          <button type="button" className="action-btn" onClick={handleShare}>
            ↗ Partager
          </button>
          <FavoriteButton cible={favoriCible} className="action-btn" />
        </div>
      </div>

      <div className="gallery" onClick={() => setGalleryOpen(true)} style={{ cursor: "pointer" }}>
        {vente.images.slice(0, 4).map((img, i) => (
          <div
            key={i}
            className={`gallery-img${i === 0 ? " main" : ""}`}
            style={{ backgroundImage: `url('${img}')` }}
          >
            {i === 3 && vente.images.length >= 4 && (
              <div className="gallery-more">
                <CameraIcon /> Voir toutes les photos
              </div>
            )}
          </div>
        ))}
      </div>

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
          >
            ✕
          </button>
          <img
            src={vente.images[activeImg]}
            alt={vente.nom}
            style={{ maxHeight: "80vh", maxWidth: "90vw", objectFit: "contain", borderRadius: 8 }}
            onClick={(e) => e.stopPropagation()}
          />
          <div style={{ display: "flex", gap: 10, marginTop: 18 }} onClick={(e) => e.stopPropagation()}>
            {vente.images.map((img, i) => (
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
        </div>
      )}

      <div className="body-grid">
        <div>
          <div className="info-block">
            <div className="annonce-id">
              Annonce <strong>#{vente.annonceId}</strong>
            </div>
            <div className="info-stats">
              {stats.map((s) => (
                <div className="info-stat" key={s.label}>
                  <div className="info-stat-num">{s.num}</div>
                  <div className="info-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="info-block">
            <div className="info-label">Description</div>
            <h2 className="info-title">{vente.descriptionTitre}</h2>
            <p
              className="info-text"
              dangerouslySetInnerHTML={{ __html: vente.descriptionHtml }}
            />
          </div>

          <div className="info-block">
            <div className="info-label">Caractéristiques exceptionnelles</div>
            {vente.features.map((f) => (
              <div className="feature-block" key={f.titre}>
                <div className="feature-block-title">
                  <span className="feature-block-icon">
                    {f.icon && <i className={`fas ${f.icon}`} aria-hidden="true" />}
                  </span>
                  {f.titre}
                </div>
                <ul>
                  {f.items.map((item) => (
                    <li key={item} dangerouslySetInnerHTML={{ __html: item }} />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="price-card">
            <div className="price-label">Prix demandé</div>
            <div className="price-amount">{vente.prix}</div>
            <div className="price-note">Vente directe par le propriétaire</div>

            <div className="price-features">
              {vente.priceFeatures.map((pf) => (
                <div className="price-features-row" key={pf.label}>
                  <span>{pf.label}</span>
                  <strong>{pf.value}</strong>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="price-cta"
              onClick={handleOrganizeClick}
            >
              Organiser une visite privée →
            </button>
            <button
              type="button"
              className="price-secondary"
              onClick={() => setContactOpen(true)}
            >
              Contacter l&apos;annonceur
            </button>
          </div>
        </div>
      </div>

      {/* MODAL DE RÉSERVATION */}
      {bookingOpen && (
        <div className="booking-modal">
          <div className="booking-modal-content">
            <h3>Organiser une visite privée</h3>
            <label>
              Date de visite :
              <input
                type="date"
                value={bookingDate}
                onChange={e => setBookingDate(e.target.value)}
              />
            </label>
            <label>
              Nombre d&apos;invités :
              <input
                type="number"
                min="1"
                value={bookingInvites}
                onChange={e => setBookingInvites(parseInt(e.target.value) || 1)}
              />
            </label>
            <button className="booking-modal-cta" onClick={handleBookingSubmit}>
              Faire la réservation
            </button>
            <button className="booking-modal-cancel" onClick={() => setBookingOpen(false)}>
              Annuler
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

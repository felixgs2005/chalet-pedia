import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../services/bookingsFirestore";

export default function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { chaletSlug, chaletId, dateVisite, nbInvites, returnPath } = location.state || {};

  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted) {
      alert("Vous devez accepter les termes et conditions.");
      return;
    }
    setSubmitting(true);
    try {
      await createBooking({
        chaletSlug,
        chaletId,
        userUid: currentUser?.uid,
        userEmail: currentUser?.email,
        dateVisite,
        nbInvites,
        notes,
      });
      alert("Réservation envoyée avec succès !");
      // If a returnPath was provided (ex: vente page), use it; otherwise fall back to rental chalet route.
      if (returnPath) {
        navigate(returnPath);
      } else if (chaletSlug) {
        navigate(`/chalet/${chaletSlug}`);
      } else {
        // Safe fallback to reservations page if no slug provided
        navigate(`/compte/reservations/`);
      }
    } catch (e) {
      console.error(e);
      alert(e.message || "Erreur lors de l'envoi de la réservation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    // Should not happen because route is protected, but fallback
    return <div>Chargement...</div>;
  }

  return (
    <div className="confirm-booking-page">
      <h2>Confirmation de votre visite privée</h2>
      <p>
        <strong>Chalet :</strong> {chaletSlug}
      </p>
      <p>
        <strong>Date prévue :</strong> {dateVisite}
      </p>
      <p>
        <strong>Nombre d'invités :</strong> {nbInvites}
      </p>
      <label>
        Notes additionnelles (facultatif) :
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          style={{ width: "100%", marginTop: 8 }}
        />
      </label>
      <div style={{ marginTop: 12 }}>
        <label>
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />{' '}
          J'accepte les <a href="/conditions-utilisation" target="_blank" rel="noopener noreferrer">termes et conditions</a>
        </label>
      </div>
      <button
        type="button"
        className="booking-submit-cta"
        onClick={handleSubmit}
        disabled={submitting}
        style={{ marginTop: 16, padding: "8px 16px" }}
      >
        {submitting ? "Envoi…" : "Confirmer et envoyer la demande"}
      </button>
    </div>
  );
}

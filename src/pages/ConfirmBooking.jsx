import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createBooking } from "../services/bookingsFirestore";

function formatChaletName(slug) {
  if (!slug) return "ce chalet";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatVisitDate(dateValue) {
  if (!dateValue) return "";
  const parsed = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return dateValue;
  return new Intl.DateTimeFormat("fr-CA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

function formatGuests(nb) {
  if (!nb) return "";
  return nb === 1 ? "1 personne" : `${nb} personnes`;
}

export default function ConfirmBooking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const { chaletSlug, chaletId, dateVisite, nbInvites, returnPath } = location.state || {};
  const { typeEntite } = location.state || {};

  const [notes, setNotes] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const chaletName = formatChaletName(chaletSlug);
  const visitDate = formatVisitDate(dateVisite);
  const guestsLabel = formatGuests(nbInvites);
  const backPath = returnPath || `/chalet/${chaletSlug}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!termsAccepted) {
      setError("Merci d'accepter les termes et conditions avant d'envoyer.");
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        chaletSlug,
        chaletId,
        typeEntite,
        userUid: currentUser?.uid,
        userEmail: currentUser?.email,
        dateVisite,
        nbInvites,
        notes,
      });
      alert("C'est envoyé — le propriétaire vous contactera bientôt.");
      if (returnPath) {
        navigate(returnPath);
      } else if (chaletSlug) {
        navigate(`/chalet/${chaletSlug}`);
      } else {
        navigate("/compte/reservations/");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "On n'a pas pu envoyer la demande. Réessayez dans un moment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="confirm-booking-page">
        <div className="confirm-booking-shell">
          <p className="confirm-booking-loading">Chargement…</p>
        </div>
      </div>
    );
  }

  if (!chaletSlug || !dateVisite) {
    return (
      <div className="confirm-booking-page">
        <div className="confirm-booking-shell">
          <div className="confirm-booking-empty">
            <h1>On ne trouve pas votre demande</h1>
            <p>
              Repassez par la fiche du chalet pour choisir une date de visite.
            </p>
            <Link to="/chalets/chalets-a-louer" className="confirm-booking-submit">
              Voir les chalets à louer
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="confirm-booking-page">
      <div className="confirm-booking-shell">
        <header className="confirm-booking-header">
          <h1 className="confirm-booking-title">Demande de visite</h1>
          <p className="confirm-booking-lead">
            Vous souhaitez visiter{" "}
            <Link to={backPath} className="confirm-booking-link">
              {chaletName}
            </Link>{" "}
            le <strong className="confirm-booking-lead__date">{visitDate}</strong>
            {guestsLabel ? (
              <>
                , accompagné de <strong>{guestsLabel}</strong>
              </>
            ) : null}
            . Le propriétaire recevra votre demande et pourra vous répondre.
          </p>
        </header>

        <div className="confirm-booking-card">
          <section className="confirm-booking-recap" aria-label="Résumé de la visite">
            <h2 className="confirm-booking-recap__title">En bref</h2>
            <dl className="confirm-booking-recap__dl">
              <div className="confirm-booking-recap__item">
                <dt>Chalet</dt>
                <dd>
                  <Link to={`/chalet/${chaletSlug}`}>{chaletName}</Link>
                </dd>
              </div>
              <div className="confirm-booking-recap__item">
                <dt>Date</dt>
                <dd className="confirm-booking-recap__date">{visitDate}</dd>
              </div>
              <div className="confirm-booking-recap__item">
                <dt>Invités</dt>
                <dd>{guestsLabel || "—"}</dd>
              </div>
            </dl>
            <p className="confirm-booking-recap__aside">
              Pas de paiement pour l&apos;instant — c&apos;est une simple demande
              de visite.
            </p>
          </section>

          <div className="confirm-booking-divider" role="presentation" />

          <form className="confirm-booking-form" onSubmit={handleSubmit}>
            <div className="confirm-booking-field">
              <label className="confirm-booking-label" htmlFor="booking-notes">
                Un mot pour le propriétaire ?
                <span className="confirm-booking-label__opt"> Facultatif</span>
              </label>
              <textarea
                id="booking-notes"
                className="confirm-booking-textarea"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Par exemple : je passe dans le coin en après-midi, vers 14 h."
                rows={4}
              />
            </div>

            <label className="confirm-booking-terms">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span>
                J&apos;accepte les{" "}
                <a
                  href="/conditions-utilisation"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  termes et conditions
                </a>
                .
              </span>
            </label>

            {error ? (
              <p className="confirm-booking-error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="confirm-booking-actions">
              <button
                type="submit"
                className="confirm-booking-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="confirm-booking-submit__spinner" aria-hidden="true" />
                    Envoi…
                  </>
                ) : (
                  "Envoyer au propriétaire"
                )}
              </button>
              <button
                type="button"
                className="confirm-booking-back"
                onClick={() => navigate(backPath)}
              >
                Annuler et revenir au chalet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

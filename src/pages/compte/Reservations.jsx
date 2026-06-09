import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchBookingsForUser, deleteBooking } from "../../services/bookingsFirestore";

// Canonical keys: 'pending', 'confirmed', 'cancelled'
const STATUT_LABELS = {
  pending: "En attente",
  confirmed: "Confirmée",
  cancelled: "Annulée",
};

const STATUT_CLASSES = {
  confirmed: "compte-reservations-badge--confirmed",
  cancelled: "compte-reservations-badge--cancelled",
};

function normalizeStatut(raw) {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  // remove accents for comparison
  const normalized = s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, " ")
    .replace(/ /g, "_");

  if (/(en[_ ]?attente|en_attente|pending)/.test(normalized)) return "pending";
  if (/(approuv|approuve|approuvé|confir|confirm|confirme|confirmé)/.test(normalized)) return "confirmed";
  if (/(annul|annule|annulé|cancel)/.test(normalized)) return "cancelled";
  return normalized;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatCreatedAt(ts) {
  if (!ts) return "";
  // Firestore Timestamp
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Reservations() {
  const { currentUser } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!currentUser?.uid) return;
      setLoading(true);
      setError(null);

      try {
        const data = await fetchBookingsForUser(currentUser.uid);
        // Sort by date descending (most recent first)
        data.sort((a, b) => {
          const da = a.dateVisite || "";
          const db2 = b.dateVisite || "";
          return db2.localeCompare(da);
        });
        if (!cancelled) setBookings(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const total = bookings.length;

  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner compte-reglages__inner--wide">
        <div className="compte-favoris-head">
          <h1 className="compte-reglages__title">Mes réservations</h1>
          {!loading && total > 0 && (
            <span className="compte-favoris-count" aria-live="polite">
              {total} réservation{total > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading && (
          <p className="compte-reglages__loading">Chargement de vos réservations…</p>
        )}

        {error && (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error.message || "Impossible de charger vos réservations."}
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="compte-reservations-empty">
            <div className="compte-reservations-empty__icon">📅</div>
            <p className="compte-reservations-empty__text">
              Vous n&apos;avez pas encore de réservation.
            </p>
            <Link to="/chalets/chalet-a-louer/" className="compte-reservations-empty__cta">
              Explorer les chalets à louer
            </Link>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <ul className="compte-reservations-list">
            {bookings.map((b) => (
              <li key={b.id} className="compte-reservations-card">
                <div className="compte-reservations-card__header">
                  <Link
                    to={`/chalet/${b.chaletSlug}`}
                    className="compte-reservations-card__chalet"
                  >
                    🏔️ {b.chaletSlug}
                  </Link>
                  {(() => {
                    const key = normalizeStatut(b.statut);
                    if (!key || key === "pending") return null;
                    const cls = STATUT_CLASSES[key] || "";
                    const label = STATUT_LABELS[key] || b.statut;
                    return (
                      <span className={`compte-reservations-badge ${cls}`}>{label}</span>
                    );
                  })()}
                </div>

                <div className="compte-reservations-card__details">
                  <div className="compte-reservations-card__detail">
                    <span className="compte-reservations-card__detail-label">Date de visite</span>
                    <span className="compte-reservations-card__detail-value">
                      {formatDate(b.dateVisite)}
                    </span>
                  </div>
                  <div className="compte-reservations-card__detail">
                    <span className="compte-reservations-card__detail-label">Invités</span>
                    <span className="compte-reservations-card__detail-value">
                      {b.nbInvites} personne{b.nbInvites > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="compte-reservations-card__detail">
                    <span className="compte-reservations-card__detail-label">Demande envoyée</span>
                    <span className="compte-reservations-card__detail-value">
                      {formatCreatedAt(b.createdAt)}
                    </span>
                  </div>
                </div>

                {b.notes && (
                  <div className="compte-reservations-card__notes">
                    <span className="compte-reservations-card__detail-label">Notes</span>
                    <p className="compte-reservations-card__notes-text">{b.notes}</p>
                  </div>
                )}
                <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                  {/* Cancel reservation button: only show when allowed (24h avant visite) */}
                  {(() => {
                    const visitTs = b.dateVisiteTs ? (b.dateVisiteTs.toDate ? b.dateVisiteTs.toDate() : new Date(b.dateVisiteTs)) : (b.dateVisite ? new Date(b.dateVisite + 'T00:00:00') : null);
                    const key = normalizeStatut(b.statut);
                    const canCancel = visitTs ? (Date.now() < (visitTs.getTime() - 24 * 60 * 60 * 1000) && key !== 'cancelled') : false;
                    return canCancel ? (
                      <button
                        type="button"
                        className="btn-plain"
                        onClick={async () => {
                          if (!window.confirm('Voulez-vous vraiment supprimer cette réservation ?')) return;
                          try {
                            await deleteBooking(b.id);
                            setBookings((prev) => prev.filter((x) => x.id !== b.id));
                          } catch (err) {
                            console.error(err);
                            alert('Impossible de supprimer la réservation.');
                          }
                        }}
                      >
                        Supprimer la réservation
                      </button>
                    ) : null;
                  })()}
                </div>
              </li>
            ))}
          </ul>
        )}

        <Link to="/compte/reglages/" className="compte-reglages__back">
          ← Retour aux réglages
        </Link>
      </div>
    </div>
  );
}

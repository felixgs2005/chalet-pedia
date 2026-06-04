function formatAvisDate(timestamp) {
  if (!timestamp) return "";
  const date =
    typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("fr-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Stars({ note }) {
  return (
    <span className="avis-list__stars" aria-label={`${note} sur 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= note ? "is-on" : ""}>
          ★
        </span>
      ))}
    </span>
  );
}

/** Liste des avis clients pour une fiche chalet ou service. */
export default function AvisList({ avis, loading, onWriteReview }) {
  return (
    <section className="avis-section info-block">
      <div className="avis-section__head">
        <div className="info-label">Avis clients</div>
        {onWriteReview && (
          <button type="button" className="avis-section__write" onClick={onWriteReview}>
            Rédiger un avis
          </button>
        )}
      </div>

      {loading && <p className="avis-list__empty">Chargement des avis…</p>}

      {!loading && avis.length === 0 && (
        <p className="avis-list__empty">Aucun avis pour le moment. Soyez le premier à en laisser un.</p>
      )}

      {!loading && avis.length > 0 && (
        <ul className="avis-list">
          {avis.map((item) => (
            <li key={item.id} className="avis-card">
              <div className="avis-card__header">
                <div className="avis-card__author">{item.auteur}</div>
                <Stars note={item.note} />
              </div>
              {item.dateCreation && (
                <time className="avis-card__date" dateTime={formatAvisDate(item.dateCreation)}>
                  {formatAvisDate(item.dateCreation)}
                </time>
              )}
              <p className="avis-card__text">{item.texte}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

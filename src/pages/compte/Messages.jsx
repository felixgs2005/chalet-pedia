import { Link } from "react-router-dom";
import { useMessageThreads } from "../../hooks/useMessageThreads";

export default function Messages() {
  const { threads, loading, error } = useMessageThreads();

  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner compte-reglages__inner--wide">
        <h1 className="compte-reglages__title">Messages</h1>

        {loading && <p className="compte-reglages__loading">Chargement de vos messages…</p>}

        {error && (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error.message || "Impossible de charger vos messages."}
          </div>
        )}

        {!loading && !error && threads.length === 0 && (
          <p className="compte-reglages__loading">Aucun message pour le moment.</p>
        )}

        {!loading && threads.length > 0 && (
          <ul className="compte-messages-list">
            {threads.map((thread) => (
              <li key={thread.conversationKey}>
                <Link
                  to={`/compte/messages/${encodeURIComponent(thread.conversationKey)}/`}
                  className="compte-messages-row"
                >
                  <span className="compte-messages-row__icon" aria-hidden="true">
                    ✉
                  </span>
                  <span className="compte-messages-row__name">{thread.otherName}</span>
                  <span className="compte-messages-row__listing">
                    <span className="compte-messages-row__listing-icon" aria-hidden="true">
                      📝
                    </span>
                    {thread.entiteTitre}
                  </span>
                  <time className="compte-messages-row__date">{thread.dateLabel}</time>
                </Link>
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

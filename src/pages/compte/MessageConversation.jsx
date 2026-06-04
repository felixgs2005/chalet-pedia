import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useConversationMessages } from "../../hooks/useConversationMessages";
import { sendMessage } from "../../services/messagesFirestore";

const IconListing = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M20 6 9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function MessageConversation() {
  const { conversationKey: rawKey } = useParams();
  const conversationKey = rawKey ? decodeURIComponent(rawKey) : "";
  const { currentUser } = useAuth();
  const { messages, loading, error, refresh } = useConversationMessages(conversationKey);
  const [reply, setReply] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const header = useMemo(() => {
    const last = messages[messages.length - 1];
    if (!last) return { title: "Messages", cible: null };
    const other =
      last.expediteur.uid === currentUser?.uid ? last.destinataire : last.expediteur;
    return {
      title: `Messages de ${other.displayName}`,
      cible: {
        typeEntite: last.typeEntite,
        entiteId: last.entiteId,
        entiteTitre: last.entiteTitre,
        entiteUrl: last.entiteUrl,
        destinataireUid: other.uid,
        destinataireNom: other.displayName,
      },
    };
  }, [messages, currentUser?.uid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!header.cible) return;
    setFormError("");
    setSubmitting(true);
    try {
      await sendMessage(header.cible, {
        texte: reply,
        utilisateur: currentUser,
        fichier: file,
      });
      setReply("");
      setFile(null);
      setFileName("");
      refresh();
    } catch (err) {
      setFormError(err.message || "Impossible d'envoyer le message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="compte-reglages">
      <div className="compte-reglages__inner compte-reglages__inner--wide">
        <Link to="/compte/messages/" className="compte-reglages__back compte-reglages__back--top">
          ← Retour aux messages
        </Link>

        <h1 className="compte-reglages__title">{header.title}</h1>

        {loading && <p className="compte-reglages__loading">Chargement…</p>}

        {error && (
          <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
            {error.message || "Impossible de charger la conversation."}
          </div>
        )}

        {!loading && messages.length > 0 && (
          <ul className="compte-conversation__thread">
            {messages.map((msg) => {
              const isMine = msg.expediteur.uid === currentUser?.uid;
              return (
                <li key={msg.id} className="compte-conversation__card">
                  <span
                    className="compte-conversation__card-check"
                    aria-hidden={!isMine}
                    title={isMine ? "Message envoyé" : undefined}
                  >
                    {isMine ? <IconCheck /> : null}
                  </span>

                  <div className="compte-conversation__card-listing">
                    <IconListing />
                    <span>{msg.entiteTitre}</span>
                  </div>

                  <div className="compte-conversation__card-author">
                    {msg.expediteur.displayName}
                  </div>

                  <time className="compte-conversation__card-date" dateTime={msg.dateLabel}>
                    {msg.dateLabel}
                  </time>

                  <p className="compte-conversation__card-text">{msg.texte}</p>

                  {msg.pieceJointeUrl && (
                    <a
                      href={msg.pieceJointeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="compte-conversation__card-attachment"
                    >
                      📎 {msg.pieceJointeNom || "Fichier joint"}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {header.cible && (
          <form className="compte-conversation__compose" onSubmit={handleSubmit}>
            {formError && (
              <div className="compte-reglages__alert compte-reglages__alert--error" role="alert">
                {formError}
              </div>
            )}

            <div className="compte-conversation__compose-field">
              <label className="compte-conversation__compose-label" htmlFor="conversation-reply">
                Message
              </label>
              <textarea
                id="conversation-reply"
                className="compte-conversation__compose-textarea"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={8}
                disabled={submitting}
              />
            </div>

            <div className="compte-conversation__compose-field">
              <span className="compte-conversation__compose-label compte-conversation__compose-label--muted">
                Fichier joint (facultatif)
              </span>
              <label className="compte-conversation__file-btn">
                <input
                  type="file"
                  className="compte-conversation__file-input"
                  disabled={submitting}
                  onChange={(e) => {
                    const selected = e.target.files?.[0] || null;
                    setFile(selected);
                    setFileName(selected?.name || "");
                  }}
                />
                {fileName || "Choisissez un fichier"}
              </label>
            </div>

            <button
              type="submit"
              className="compte-conversation__compose-submit"
              disabled={submitting}
            >
              {submitting ? "Envoi…" : "Contacter l'annonceur"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

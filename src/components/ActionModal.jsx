import { useCallback, useEffect, useState } from "react";

/** Coque modale partagée (fond flouté, animation, Échap). */
export default function ActionModal({ open, onClose, title, titleId, renderBody, className = "" }) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const handleClose = useCallback(() => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    window.setTimeout(() => {
      setClosing(false);
      onClose();
    }, 280);
  }, [closing, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const frame = requestAnimationFrame(() => setVisible(true));
    const onKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, handleClose]);

  if (!open && !closing) return null;

  const pageClass = [
    "sd-action-modal-page",
    visible && !closing ? "sd-action-modal-page--visible" : "",
    closing ? "sd-action-modal-page--closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const modalClass = ["sd-action-modal", className].filter(Boolean).join(" ");

  return (
    <div className={pageClass} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button type="button" className="sd-action-modal-page__backdrop" aria-label="Fermer" onClick={handleClose} />
      <div className={modalClass}>
        <button type="button" className="sd-action-modal__close" aria-label="Fermer" onClick={handleClose}>
          ×
        </button>
        <h2 id={titleId} className="sd-action-modal__title">
          {title}
        </h2>
        {renderBody({ requestClose: handleClose })}
      </div>
    </div>
  );
}

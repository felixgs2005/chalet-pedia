import { useState } from "react";
import { ReportModal } from "./ServiceListingModals";

const IconPencil = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const IconFlag = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1Z" />
    <line x1="4" y1="22" x2="4" y2="15" />
  </svg>
);

/** Liens secondaires sous la carte contact (avis + signalement). */
export default function ListingActionLinks({ listing, onWriteReview }) {
  const [reportOpen, setReportOpen] = useState(false);

  const linkClass = (id, isOpen) =>
    `sd-link-action${isOpen ? " is-open" : ""}${id === "report" ? " sd-link-action--danger" : ""}`;

  return (
    <>
      <div className="sd-contact-card__links">
        <button type="button" className={linkClass("review", false)} onClick={onWriteReview}>
          <IconPencil /> Rédiger un avis
        </button>
        <button type="button" className={linkClass("report", reportOpen)} onClick={() => setReportOpen(true)}>
          <IconFlag /> Signaler l&apos;annonce
        </button>
      </div>
      <ReportModal open={reportOpen} onClose={() => setReportOpen(false)} listing={listing} />
    </>
  );
}

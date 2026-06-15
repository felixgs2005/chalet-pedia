import { formatDisplayValue } from "../utils/formatDisplayValue";

/**
 * Rendu partagé des blocs de description (public ou admin).
 */
export default function DescriptionBlocksContent({ blocks, variant = "public", emptyFallback = null }) {
  if (!blocks?.length) {
    return emptyFallback;
  }

  const isAdmin = variant === "admin";

  if (isAdmin) {
    return (
      <div className="admin-detail__blocks">
        {blocks.map((block, i) => {
          if (block.h) {
            return (
              <h4 className="admin-detail__desc-heading" key={i}>
                {formatDisplayValue(block.h)}
              </h4>
            );
          }
          if (block.ul?.length > 0) {
            return (
              <ul className="admin-detail__desc-list" key={i}>
                {block.ul.map((entry, j) => (
                  <li key={j}>{formatDisplayValue(entry)}</li>
                ))}
              </ul>
            );
          }
          if (block.p) {
            return (
              <p
                className={`admin-detail__description${block.bold ? " admin-detail__description--bold" : ""}`}
                key={i}
              >
                {formatDisplayValue(block.p)}
              </p>
            );
          }
          return null;
        })}
      </div>
    );
  }

  return (
    <>
      {blocks.map((block, i) => {
        if (block.h) {
          return (
            <h3 className="sd-desc-h" key={i}>
              {formatDisplayValue(block.h)}
            </h3>
          );
        }

        if (block.ul?.length > 0 && block.isServicesList) {
          return (
            <div key={i}>
              <div className="info-label" style={{ marginTop: i > 0 ? 18 : 0 }}>
                Services
              </div>
              <div className="sd-services">
                {block.ul.map((item, j) => (
                  <div className="sd-service" key={j} style={{ "--i": j }}>
                    <span className="sd-service__num">{j + 1}</span>
                    <span className="sd-service__text">{formatDisplayValue(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        if (block.ul?.length > 0) {
          return (
            <ul className="sd-desc-list" key={i}>
              {block.ul.map((item, j) => (
                <li key={j} style={{ "--j": j }}>
                  {formatDisplayValue(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.p) {
          return (
            <p
              className="info-text"
              key={i}
              style={block.bold ? { fontWeight: 700, color: "#0F0F0F" } : undefined}
            >
              {formatDisplayValue(block.p)}
            </p>
          );
        }

        return null;
      })}
    </>
  );
}

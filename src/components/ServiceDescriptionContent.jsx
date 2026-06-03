import { getServiceDescriptionBlocks } from "../utils/serviceDescription";

/**
 * Affiche la description d'une annonce service (blocs Firestore ou champs legacy).
 */
export default function ServiceDescriptionContent({ listing }) {
  const blocks = getServiceDescriptionBlocks(listing);

  if (blocks.length === 0) {
    return (
      <p className="info-text" style={{ color: "#9A9A98" }}>
        Aucune description disponible pour cette annonce.
      </p>
    );
  }

  return (
    <>
      {blocks.map((block, i) => {
        if (block.h) {
          return (
            <h3 className="sd-desc-h" key={i}>
              {block.h}
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
                    <span className="sd-service__text">{item}</span>
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
                  {item}
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
              {block.p}
            </p>
          );
        }

        return null;
      })}
    </>
  );
}

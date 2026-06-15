import DescriptionBlocksContent from "./DescriptionBlocksContent";
import { getServiceDescriptionBlocks } from "../utils/serviceDescription";

/**
 * Affiche la description d'une annonce service (blocs Firestore ou champs legacy).
 */
export default function ServiceDescriptionContent({ listing }) {
  const blocks = getServiceDescriptionBlocks(listing);

  return (
    <DescriptionBlocksContent
      blocks={blocks}
      variant="public"
      emptyFallback={
        <p className="info-text" style={{ color: "#9A9A98" }}>
          Aucune description disponible pour cette annonce.
        </p>
      }
    />
  );
}

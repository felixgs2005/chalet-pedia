/** Firestore peut renvoyer un tableau ou une map indexée (0, 1, 2…). */
export function normalizeDescriptionArray(description) {
  if (!description) return [];
  if (Array.isArray(description)) return description;
  if (typeof description === "object") {
    return Object.keys(description)
      .filter((key) => /^\d+$/.test(key))
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => description[key])
      .filter(Boolean);
  }
  return [];
}

/** Normalise contenu liste Firestore (array ou map indexée). */
export function normalizeListContent(contenu) {
  if (!contenu) return [];
  if (Array.isArray(contenu)) return contenu.filter(Boolean);
  if (typeof contenu === "object") {
    return Object.keys(contenu)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => contenu[key])
      .filter(Boolean);
  }
  return [String(contenu)];
}

/** Blocs Firestore ({ type, contenu }) → format UI pour ServiceDetail. */
export function mapDescriptionBlocksFromFirestore(blocks) {
  const normalized = normalizeDescriptionArray(blocks);
  if (!normalized.length) return [];

  return normalized
    .map((block) => {
      if (block.h) return { h: block.h };
      if (block.p) return { p: block.p, bold: Boolean(block.bold) };
      if (block.ul) {
        return {
          ul: normalizeListContent(block.ul),
          isServicesList: Boolean(block.isServicesList),
        };
      }

      const type = block.type;
      const contenu = block.contenu ?? block.content;

      if (type === "titre" || type === "heading") {
        return { p: contenu, bold: true };
      }
      if (type === "paragraphe" || type === "paragraph") {
        return { p: contenu, bold: Boolean(block.gras || block.bold) };
      }
      if (type === "liste" || type === "list") {
        return {
          ul: normalizeListContent(contenu),
          isServicesList: true,
        };
      }
      return null;
    })
    .filter(Boolean);
}

/** Extrait accroche / intro / services depuis les blocs bruts ou mappés. */
export function extractLegacyFieldsFromDescription(rawBlocks) {
  const result = { accroche: "", intro: "", services: null };
  const blocks = normalizeDescriptionArray(rawBlocks);
  if (!blocks.length) return result;

  for (const block of blocks) {
    const type = block.type;
    const contenu = block.contenu ?? block.content;

    if ((type === "titre" || block.h) && !result.accroche) {
      result.accroche = block.h || contenu || "";
    } else if ((type === "paragraphe" || block.p) && !result.intro) {
      result.intro = block.p || contenu || "";
    } else if (type === "liste" || block.ul) {
      const items = block.ul ? normalizeListContent(block.ul) : normalizeListContent(contenu);
      if (items.length) result.services = items;
    }
  }

  return result;
}

/** Blocs à afficher : Firestore description ou champs legacy (accroche, intro, services). */
export function getServiceDescriptionBlocks(listing) {
  const fromFirestore = mapDescriptionBlocksFromFirestore(listing.description);
  if (fromFirestore.length > 0) return fromFirestore;

  const blocks = [];
  if (listing.accroche) {
    blocks.push({ p: listing.accroche, bold: true });
  }
  if (listing.intro) {
    blocks.push({ p: listing.intro });
  }
  if (Array.isArray(listing.services) && listing.services.length > 0) {
    blocks.push({ ul: listing.services, isServicesList: true });
  }
  return blocks;
}

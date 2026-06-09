/** Parse les tags saisis (virgules ou retours ligne). */
import { parsePrixDigits } from "./formatPrix";

export function parseTagsInput(value) {
  return String(value || "")
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Parse une liste simple (équipements location : une entrée par ligne ou virgule). */
export function parseEquipementsInput(value) {
  return parseTagsInput(value);
}

function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .trim();
}

/** Parse les blocs caractéristiques (titre + items multiligne). */
export function parseCaracteristiquesInput(blocks) {
  if (!Array.isArray(blocks)) return [];
  return blocks
    .map((block) => ({
      titre: String(block.titre || "").trim(),
      items: String(block.items || "")
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean),
    }))
    .filter((block) => block.titre && block.items.length > 0);
}

/**
 * Valide le formulaire avant envoi Firestore.
 * @returns {{ ok: true, tags: string[] } | { ok: false, message: string }}
 */
export function validateSubmitListingForm(form, { photoCount = 0 } = {}) {
  const isVente = form.categorie === "chalets-vendre";
  const tags = parseTagsInput(form.tags);

  if (!form.categorie) {
    return { ok: false, message: "La catégorie est obligatoire." };
  }
  if (!form.titre?.trim()) {
    return { ok: false, message: "Le titre est obligatoire." };
  }
  const slug = (form.slug || "").trim();
  if (!slug) {
    return { ok: false, message: "L'identifiant URL (slug) est obligatoire." };
  }
  if (!form.localisation?.trim()) {
    return { ok: false, message: "La localisation est obligatoire (ville et région)." };
  }
  if (photoCount < 1) {
    return { ok: false, message: "Au moins une photo de la galerie est obligatoire." };
  }

  if (isVente) {
    if (!form.descriptionTitre?.trim()) {
      return { ok: false, message: "L'accroche de la description est obligatoire." };
    }
    if (!stripHtml(form.description)) {
      return { ok: false, message: "La description est obligatoire." };
    }
    const prixDigits = parsePrixDigits(form.prix);
    if (!prixDigits) {
      return { ok: false, message: "Le prix demandé est obligatoire." };
    }
    if (Number(prixDigits) < 1) {
      return { ok: false, message: "Le prix demandé doit être un montant valide." };
    }
    const caracteristiques = parseCaracteristiquesInput(form.caracteristiques);
    if (caracteristiques.length === 0) {
      return {
        ok: false,
        message: "Ajoutez au moins une section de caractéristiques (titre + un point).",
      };
    }
  } else {
    if (!form.sousTitre?.trim()) {
      return { ok: false, message: "Le sous-titre est obligatoire." };
    }
    if (tags.length === 0) {
      return { ok: false, message: "Au moins un tag est obligatoire." };
    }
    if (!form.description?.trim()) {
      return { ok: false, message: "La description est obligatoire." };
    }
    if (!form.citq?.trim()) {
      return { ok: false, message: "Le numéro CITQ est obligatoire." };
    }
    if (form.prixParNuit === "" || form.prixParNuit == null) {
      return { ok: false, message: "Le prix par nuit est obligatoire." };
    }
    if (Number(form.prixParNuit) < 1) {
      return { ok: false, message: "Le prix par nuit doit être d'au moins 1 $." };
    }
    const equipements = parseEquipementsInput(form.equipements);
    if (equipements.length === 0) {
      return {
        ok: false,
        message: "Ajoutez au moins un équipement ou une caractéristique (ex. : Spa, Foyer, Bord de l'eau).",
      };
    }
    if (!form.nombrePersonnes || Number(form.nombrePersonnes) < 1) {
      return { ok: false, message: "Le nombre de personnes est obligatoire." };
    }
  }

  if (form.nombreChambres === "" || form.nombreChambres == null) {
    return { ok: false, message: "Le nombre de chambres est obligatoire." };
  }
  if (form.nombreSallesBain === "" || form.nombreSallesBain == null) {
    return { ok: false, message: "Le nombre de salles de bain est obligatoire." };
  }

  const siteWeb = form.siteWeb?.trim() || "";
  if (siteWeb && !isValidUrl(siteWeb)) {
    return { ok: false, message: "Le lien du site web doit être une URL valide (http ou https)." };
  }

  const videoUrl = form.videoUrl?.trim() || "";
  if (videoUrl && !isValidUrl(videoUrl)) {
    return { ok: false, message: "Le lien vidéo doit être une URL valide (http ou https)." };
  }

  const lienBlog = form.lienBlog?.trim() || "";
  if (lienBlog && !isValidUrl(lienBlog)) {
    return { ok: false, message: "Le lien de l'article de blog doit être une URL valide." };
  }

  return { ok: true, tags };
}

/** Parse les tags saisis (virgules ou retours ligne). */
export function parseTagsInput(value) {
  return String(value || "")
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);
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
  if (tags.length === 0) {
    return { ok: false, message: "Au moins un tag est obligatoire." };
  }
  if (!form.description?.trim()) {
    return { ok: false, message: "La description est obligatoire." };
  }
  if (!stripHtml(form.tarification)) {
    return { ok: false, message: "La tarification est obligatoire." };
  }
  if (!form.citq?.trim()) {
    return { ok: false, message: "Le numéro CITQ est obligatoire." };
  }
  if (photoCount < 1) {
    return { ok: false, message: "Au moins une photo de la galerie est obligatoire." };
  }

  if (isVente) {
    if (!form.prix?.trim()) {
      return { ok: false, message: "Le prix demandé est obligatoire." };
    }
  } else {
    if (form.prixParNuit === "" || form.prixParNuit == null) {
      return { ok: false, message: "Le prix par nuit est obligatoire." };
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

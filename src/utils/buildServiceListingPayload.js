/** Génère un slug URL à partir du titre de l'annonce. */
export function slugifyServiceTitle(text) {
  return String(text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatPublicationDateFr(date = new Date()) {
  return date.toLocaleDateString("fr-CA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function parseImageList(main, extra) {
  const urls = [];
  if (main?.trim()) urls.push(main.trim());
  if (extra?.trim()) {
    extra
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((url) => {
        if (!urls.includes(url)) urls.push(url);
      });
  }
  return urls;
}

/**
 * Convertit le formulaire annonceur → document Firestore annoncesService.
 * @see scripts/seedMappers.mjs mapServiceListingToFirestore
 */
export function buildServiceListingPayload(form, { imageUrls = [] } = {}) {
  const images =
    imageUrls.length > 0
      ? imageUrls
      : parseImageList(form.imagePrincipale, form.imagesSupplementaires);
  const services = (form.services || []).map((s) => s.trim()).filter(Boolean);
  const slug = (form.slug || slugifyServiceTitle(form.titre)).trim();

  const description = [];

  if (form.descTitre?.trim()) {
    description.push({ type: "titre", contenu: form.descTitre.trim() });
  }
  if (form.descParagraphe?.trim()) {
    description.push({ type: "paragraphe", contenu: form.descParagraphe.trim() });
  }
  if (services.length > 0) {
    description.push({ type: "liste", contenu: services });
  }
  if (form.courriel?.trim() || form.telephone?.trim() || form.adresse?.trim()) {
    description.push({ type: "titre", contenu: "Coordonnées" });
    description.push({
      type: "liste",
      contenu: [form.courriel, form.telephone, form.adresse].map((v) => v?.trim()).filter(Boolean),
    });
  }

  return {
    titre: form.titre.trim(),
    slug,
    localisation: form.localisation.trim(),
    carte: (form.carte || form.localisation).trim(),
    numero: form.numero?.trim() ? String(form.numero).trim() : "",
    datePublication: form.datePublication?.trim() || formatPublicationDateFr(),
    statut: "En attente",
    image: images[0] || "",
    images,
    description,
    courrielContact: form.courriel?.trim() || "",
    telephoneContact: form.telephone?.trim() || "",
    adresseContact: form.adresse?.trim() || "",
  };
}

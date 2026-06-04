import { slugifyServiceTitle } from "./buildServiceListingPayload";
import { parseTagsInput } from "./validateSubmitListingForm";

export { slugifyServiceTitle as slugifyChaletTitle };

/** Ex. « Mont-Tremblant, Laurentides » → { adresse, region } */
export function parseLocalisation(value) {
  const raw = String(value || "").trim();
  if (!raw) return { adresse: "", region: "" };

  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      adresse: raw,
      region: parts[parts.length - 1],
    };
  }
  return { adresse: raw, region: raw };
}

function toNumberOrNull(value) {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/**
 * Convertit le formulaire « Affichez une annonce » → document Firestore chalets/ ou ventes/.
 */
export function buildChaletListingPayload(form, { imageUrls = [], proprietaireId } = {}) {
  const slug = (form.slug || slugifyServiceTitle(form.titre)).trim();
  const { adresse, region } = parseLocalisation(form.localisation);
  const tags = parseTagsInput(form.tags);
  const tarification = form.tarification?.trim() || "";
  const citq = form.citq?.trim() || "";

  const base = {
    slug,
    statut: "En attente",
    proprietaireId: proprietaireId || "",
    images: imageUrls,
    tags,
    tarification,
    citq,
    videoUrl: form.videoUrl?.trim() || "",
    lienBlog: form.lienBlog?.trim() || "",
    dateCreation: null,
  };

  if (form.categorie === "chalets-vendre") {
    return {
      ...base,
      titre: form.titre.trim(),
      nom: form.titre.trim(),
      localisation: adresse,
      region,
      description: form.description?.trim() || "",
      descriptionHtml: form.description?.trim() || "",
      descriptionTitre: form.titre.trim(),
      prix: form.prix?.trim() || "",
      nombreChambres: toNumberOrNull(form.nombreChambres),
      nombreSallesBain: toNumberOrNull(form.nombreSallesBain),
      note: 0,
      nombreAvis: 0,
      caracteristiques: [],
      descriptionPrix: [],
    };
  }

  return {
    ...base,
    nom: form.titre.trim(),
    description: form.description?.trim() || "",
    adresse,
    region,
    prixParNuit: toNumberOrNull(form.prixParNuit),
    nombrePersonnes: toNumberOrNull(form.nombrePersonnes),
    nombreChambres: toNumberOrNull(form.nombreChambres),
    nombreSallesBain: toNumberOrNull(form.nombreSallesBain),
    note: 0,
    nombreAvis: 0,
    telephoneContact: "",
    courrielContact: "",
    equipements: [],
    coordonnees: null,
    sousTitre: "",
    badge: region,
    dateAjout: "",
    isFavori: false,
  };
}

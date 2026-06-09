import { slugifyServiceTitle } from "./buildServiceListingPayload";
import { formatPrixCAD } from "./formatPrix";
import {
  parseCaracteristiquesInput,
  parseEquipementsInput,
  parseTagsInput,
} from "./validateSubmitListingForm";

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

function stripTextFromHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
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
    siteWeb: form.siteWeb?.trim() || "",
    videoUrl: form.videoUrl?.trim() || "",
    lienBlog: form.lienBlog?.trim() || "",
    dateCreation: null,
  };

  if (form.categorie === "chalets-vendre") {
    const caracteristiques = parseCaracteristiquesInput(form.caracteristiques);
    const descriptionHtml = form.description?.trim() || "";

    return {
      ...base,
      titre: form.titre.trim(),
      nom: form.titre.trim(),
      localisation: adresse,
      region,
      regionBadge: region ? region.toUpperCase() : "",
      description: stripTextFromHtml(descriptionHtml),
      descriptionHtml,
      descriptionTitre: form.descriptionTitre?.trim() || form.titre.trim(),
      prix: formatPrixCAD(form.prix) || "",
      nombreChambres: toNumberOrNull(form.nombreChambres),
      nombreSallesBain: toNumberOrNull(form.nombreSallesBain),
      garages: toNumberOrNull(form.nombreGarages),
      etages: toNumberOrNull(form.nombreEtages),
      note: 0,
      nombreAvis: 0,
      caracteristiques,
      descriptionPrix: [],
      tags: tags.length ? tags : [],
      tarification: "",
      citq: "",
    };
  }

  const equipements = parseEquipementsInput(form.equipements);

  return {
    ...base,
    nom: form.titre.trim(),
    sousTitre: form.sousTitre?.trim() || "",
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
    equipements,
    coordonnees: null,
    badge: region ? region.toUpperCase() : "",
    dateAjout: "",
    isFavori: false,
  };
}

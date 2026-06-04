import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export function validateServiceImageFile(file) {
  if (!file) return "Fichier invalide.";
  if (!ALLOWED_TYPES.includes(file.type)) {
    return "Formats acceptés : JPG, PNG, WebP ou GIF.";
  }
  if (file.size > MAX_BYTES) {
    return "Chaque photo doit faire 5 Mo ou moins.";
  }
  return null;
}

function safeName(name) {
  return String(name || "photo")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function uploadOne(basePath, file, prefix) {
  const storageRef = ref(
    storage,
    `${basePath}/${prefix}-${Date.now()}-${safeName(file.name)}`
  );
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * Envoie la photo principale puis la galerie vers Firebase Storage.
 * @returns {Promise<string[]>} URLs publiques (principale en premier)
 */
export async function uploadServiceListingImages(categorySlug, listingSlug, { mainFile, galleryFiles = [] }) {
  if (!categorySlug || !listingSlug) {
    throw new Error("Catégorie et identifiant de fiche requis pour l'envoi des photos.");
  }

  const basePath = `services/listings/${categorySlug}/${listingSlug}`;
  const urls = [];

  if (mainFile) {
    const err = validateServiceImageFile(mainFile);
    if (err) throw new Error(err);
    urls.push(await uploadOne(basePath, mainFile, "main"));
  }

  for (let i = 0; i < galleryFiles.length; i += 1) {
    const file = galleryFiles[i];
    const err = validateServiceImageFile(file);
    if (err) throw new Error(err);
    urls.push(await uploadOne(basePath, file, `gallery-${i + 1}`));
  }

  return urls;
}

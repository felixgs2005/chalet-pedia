import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage, storageBucketName } from "../firebase";
import { validateServiceImageFile } from "./uploadServiceListingImages";

export { validateServiceImageFile as validateChaletImageFile };

function safeName(name) {
  return String(name || "photo")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function assertStorageConfigured() {
  if (!storageBucketName) {
    throw new Error(
      "REACT_APP_FIREBASE_STORAGE_BUCKET manquant dans le fichier .env à la racine de chalet-pedia."
    );
  }
}

/** Upload une photo avec suivi (plus fiable que uploadBytes si les règles réseau bloquent). */
function uploadOneResumable(basePath, file, prefix) {
  const storageRef = ref(
    storage,
    `${basePath}/${prefix}-${Date.now()}-${safeName(file.name)}`
  );

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type || "image/jpeg",
    });

    const failTimer = window.setTimeout(() => {
      try {
        task.cancel();
      } catch {
        /* ignore */
      }
      reject(
        new Error(
          "Photo bloquée après 2 minutes. Publiez storage.rules dans Firebase Console → Storage → Rules."
        )
      );
    }, 120_000);

    task.on(
      "state_changed",
      null,
      (err) => {
        window.clearTimeout(failTimer);
        reject(err);
      },
      async () => {
        window.clearTimeout(failTimer);
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Envoie les photos une par une vers Firebase Storage (évite les blocages en parallèle).
 * @returns {Promise<string[]>}
 */
export async function uploadChaletListingImages(
  categorie,
  listingSlug,
  { galleryFiles = [] }
) {
  assertStorageConfigured();

  if (!listingSlug) {
    throw new Error("Identifiant de l'annonce requis pour l'envoi des photos.");
  }

  if (!galleryFiles.length) {
    return [];
  }

  const collectionKey = categorie === "chalets-vendre" ? "ventes" : "chalets";
  const basePath = `listings/${collectionKey}/${listingSlug}`;
  const urls = [];

  for (let index = 0; index < galleryFiles.length; index += 1) {
    const file = galleryFiles[index];
    const err = validateServiceImageFile(file);
    if (err) throw new Error(err);
    const url = await uploadOneResumable(basePath, file, `photo-${index + 1}`);
    urls.push(url);
  }

  return urls;
}

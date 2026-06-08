import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";

export async function fetchUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, data) {
  if (!uid) throw new Error("Utilisateur non connecté.");
  await setDoc(
    doc(db, "users", uid),
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Enregistre le courriel du compte Auth dans users/{uid} (création ou mise à jour). */
export async function syncUserCourriel(uid, email) {
  const courriel = String(email || "").trim();
  if (!uid || !courriel) return;

  await saveUserProfile(uid, { courriel });
}

export async function uploadUserProfilePhoto(uid, file) {
  if (!uid || !file) throw new Error("Fichier ou utilisateur invalide.");
  const storageRef = ref(storage, `users/${uid}/profile-${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

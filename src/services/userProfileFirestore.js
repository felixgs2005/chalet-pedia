import { deleteField, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";

export async function fetchUserProfile(uid) {
  if (!uid) return null;
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveUserProfile(uid, data) {
  if (!uid) throw new Error("Utilisateur non connecté.");

  const { role: _ignoredRole, ...profileData } = data || {};

  await setDoc(
    doc(db, "users", uid),
    {
      ...profileData,
      role: deleteField(),
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

/** Retire le champ legacy `role` (ancien système admin par Firestore). */
export async function removeLegacyUserRole(uid) {
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists() || !("role" in snap.data())) return;

  await updateDoc(ref, { role: deleteField() });
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

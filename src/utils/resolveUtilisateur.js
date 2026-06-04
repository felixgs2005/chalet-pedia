import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/** Profil affichable pour favoris / messages / avis. */
export async function resolveUtilisateur(firebaseUser) {
  if (!firebaseUser?.uid) {
    throw new Error("Connectez-vous pour continuer.");
  }

  let prenom = "";
  let nom = "";
  const userSnap = await getDoc(doc(db, "users", firebaseUser.uid));
  if (userSnap.exists()) {
    const profile = userSnap.data();
    prenom = profile.prenom || "";
    nom = profile.nom || "";
  }

  const displayName =
    `${prenom} ${nom}`.trim() ||
    firebaseUser.displayName ||
    firebaseUser.email?.split("@")[0] ||
    "Utilisateur";

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || null,
    displayName,
    prenom: prenom || null,
    nom: nom || null,
  };
}

export async function resolveUtilisateurByUid(uid) {
  if (!uid) return { uid: "", displayName: "Utilisateur", email: null, prenom: null, nom: null };

  const userSnap = await getDoc(doc(db, "users", uid));
  if (!userSnap.exists()) {
    return { uid, displayName: "Utilisateur", email: null, prenom: null, nom: null };
  }

  const profile = userSnap.data();
  const prenom = profile.prenom || "";
  const nom = profile.nom || "";
  const displayName =
    `${prenom} ${nom}`.trim() ||
    profile.displayName ||
    profile.email?.split("@")[0] ||
    "Utilisateur";

  return {
    uid,
    email: profile.email || profile.courriel || null,
    displayName,
    prenom: prenom || null,
    nom: nom || null,
  };
}

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

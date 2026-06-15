import { fetchUserProfile } from "../services/userProfileFirestore";

/** Profil affichable pour favoris / messages / avis. */
export async function resolveUtilisateur(firebaseUser) {
  if (!firebaseUser?.uid) {
    throw new Error("Connectez-vous pour continuer.");
  }

  const profile = await fetchUserProfile(firebaseUser.uid);
  const prenom = profile?.prenom || "";
  const nom = profile?.nom || "";

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

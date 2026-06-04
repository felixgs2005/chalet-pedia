/** Message utilisateur à partir d'une erreur Firebase / réseau. */
export function mapFirebaseError(err) {
  const code = err?.code || "";
  const message = err?.message || "";

  switch (code) {
    case "permission-denied":
      return "Accès refusé par Firebase. Déployez les règles Firestore/Storage (voir firestore.rules et storage.rules) ou connectez-vous.";
    case "unauthenticated":
      return "Vous devez être connecté pour publier une annonce.";
    case "storage/unauthorized":
      return "Envoi des photos refusé. Vérifiez les règles Firebase Storage.";
    case "storage/canceled":
      return "Envoi des photos annulé.";
    case "storage/unknown":
      return "Erreur Storage Firebase. Vérifiez le bucket dans le fichier .env.";
    default:
      break;
  }

  if (/network|failed to fetch|offline/i.test(message)) {
    return "Problème de connexion réseau. Réessayez.";
  }

  return message || "Une erreur est survenue. Réessayez.";
}

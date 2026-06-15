import { getFunctions, httpsCallable } from "firebase/functions";
import app from "../firebase";

const functions = getFunctions(app, "northamerica-northeast1");

function mapCallableError(err) {
  const code = err?.code || "";
  const message = err?.message || "Une erreur est survenue.";

  if (code.includes("invalid-argument")) return message;
  if (code.includes("deadline-exceeded")) return message;
  if (code.includes("not-found")) return message;
  if (code.includes("resource-exhausted")) return message;
  if (code.includes("internal")) return message;

  return "Une erreur est survenue. Veuillez réessayer.";
}

/** Demande l'envoi d'un code de réinitialisation par courriel. */
export async function requestPasswordResetCode(email) {
  const fn = httpsCallable(functions, "requestPasswordResetCode");
  try {
    await fn({ email: String(email || "").trim() });
    return { success: true };
  } catch (err) {
    throw new Error(mapCallableError(err));
  }
}

/** Vérifie le code et définit le nouveau mot de passe. */
export async function resetPasswordWithCode({ email, code, newPassword }) {
  const fn = httpsCallable(functions, "resetPasswordWithCode");
  try {
    await fn({
      email: String(email || "").trim(),
      code: String(code || "").trim(),
      newPassword: String(newPassword || ""),
    });
    return { success: true };
  } catch (err) {
    throw new Error(mapCallableError(err));
  }
}

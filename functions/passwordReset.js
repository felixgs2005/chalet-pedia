const crypto = require("crypto");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, Timestamp, FieldValue } = require("firebase-admin/firestore");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { sendPasswordResetCodeEmail } = require("./SendEmail");

const CODE_TTL_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function normalizeEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

function generateResetCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function hashResetCode(code) {
  return crypto.createHash("sha256").update(String(code).trim()).digest("hex");
}

function createPasswordResetHandlers(region) {
  const requestPasswordResetCode = onCall({ region }, async (request) => {
    const email = normalizeEmail(request.data?.email);
    if (!email) {
      throw new HttpsError("invalid-argument", "Adresse e-mail invalide.");
    }

    let userExists = true;
    try {
      await getAuth().getUserByEmail(email);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        userExists = false;
      } else {
        console.error("requestPasswordResetCode getUserByEmail:", err);
        throw new HttpsError("internal", "Impossible d'envoyer le code pour le moment.");
      }
    }

    if (!userExists) {
      return { success: true };
    }

    const code = generateResetCode();
    const db = getFirestore();

    await db.collection("passwordResetCodes").doc(email).set({
      email,
      codeHash: hashResetCode(code),
      expiresAt: Timestamp.fromMillis(Date.now() + CODE_TTL_MS),
      tentatives: 0,
      creeLe: FieldValue.serverTimestamp(),
    });

    try {
      await sendPasswordResetCodeEmail({ email, code });
    } catch (err) {
      console.error("sendPasswordResetCodeEmail:", err);
      await db.collection("passwordResetCodes").doc(email).delete();
      throw new HttpsError("internal", "Impossible d'envoyer le courriel. Réessayez plus tard.");
    }

    return { success: true };
  });

  const resetPasswordWithCode = onCall({ region }, async (request) => {
    const email = normalizeEmail(request.data?.email);
    const code = String(request.data?.code || "").trim();
    const newPassword = String(request.data?.newPassword || "");

    if (!email) {
      throw new HttpsError("invalid-argument", "Adresse e-mail invalide.");
    }
    if (!/^\d{6}$/.test(code)) {
      throw new HttpsError("invalid-argument", "Le code doit contenir 6 chiffres.");
    }
    if (newPassword.length < 6) {
      throw new HttpsError("invalid-argument", "Le mot de passe doit contenir au moins 6 caractères.");
    }

    const db = getFirestore();
    const docRef = db.collection("passwordResetCodes").doc(email);
    const snap = await docRef.get();

    if (!snap.exists) {
      throw new HttpsError("not-found", "Code expiré ou invalide. Demandez un nouveau code.");
    }

    const data = snap.data();
    const expiresAt = data.expiresAt?.toDate?.() || new Date(0);

    if (expiresAt.getTime() < Date.now()) {
      await docRef.delete();
      throw new HttpsError("deadline-exceeded", "Code expiré. Demandez un nouveau code.");
    }

    if ((data.tentatives || 0) >= MAX_ATTEMPTS) {
      await docRef.delete();
      throw new HttpsError("resource-exhausted", "Trop de tentatives. Demandez un nouveau code.");
    }

    if (data.codeHash !== hashResetCode(code)) {
      await docRef.update({ tentatives: FieldValue.increment(1) });
      throw new HttpsError("invalid-argument", "Code incorrect.");
    }

    try {
      const user = await getAuth().getUserByEmail(email);
      await getAuth().updateUser(user.uid, { password: newPassword });
      await docRef.delete();
      return { success: true };
    } catch (err) {
      console.error("resetPasswordWithCode:", err);
      throw new HttpsError("internal", "Impossible de réinitialiser le mot de passe.");
    }
  });

  return { requestPasswordResetCode, resetPasswordWithCode };
}

module.exports = { createPasswordResetHandlers };

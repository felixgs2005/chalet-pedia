/**
 * Script ponctuel : assigner le rôle admin à un utilisateur existant.
 *
 * Prérequis :
 *   - Télécharger une clé de compte de service Firebase
 *   - Définir GOOGLE_APPLICATION_CREDENTIALS vers ce fichier JSON
 *
 * Usage (depuis le dossier functions/) :
 *   node setAdminRole.js user@example.com
 */
const admin = require("firebase-admin");

const email = process.argv[2];
if (!email) {
  console.error("Usage: node setAdminRole.js <email>");
  process.exit(1);
}

admin.initializeApp();

async function main() {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  await admin.firestore().collection("users").doc(user.uid).set(
    {
      role: "admin",
      courriel: email,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  console.log(`Admin activé pour ${email} (uid: ${user.uid})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

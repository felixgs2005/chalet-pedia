/**
 * Met à jour lienCatalogue sur les annonces service (3 catalogues externes seulement).
 * Usage : node scripts/patchLienCatalogue.mjs
 */
import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import {
  collection,
  deleteField,
  getDocs,
  initializeFirestore,
  updateDoc,
} from "firebase/firestore";

const LIEN_BY_SLUG = new Map([
  ["ova-chalet-design", "https://www.ovachaletdesign.com/"],
  ["verbois-meubles-contemporains-fabriques-au-quebec", "https://verbois.com/produits/"],
  ["rustik-decorations-en-bois-pour-chalets", "https://rustikstore.bigcartel.com/"],
]);

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function loadEnv() {
  const path = join(root, ".env");
  const raw = readFileSync(path, "utf8");
  const env = {};
  raw.split("\n").forEach((line) => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  });
  return env;
}

async function main() {
  const env = loadEnv();
  const firebaseConfig = {
    apiKey: env.REACT_APP_FIREBASE_API_KEY,
    authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_FIREBASE_APP_ID,
  };

  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true });

  const catSnap = await getDocs(collection(db, "categorieServices"));
  let updated = 0;

  for (const catDoc of catSnap.docs) {
    const listingsSnap = await getDocs(
      collection(db, "categorieServices", catDoc.id, "annoncesService")
    );

    for (const listingDoc of listingsSnap.docs) {
      const slug = listingDoc.data().slug || listingDoc.id;
      const lien = LIEN_BY_SLUG.get(slug);

      if (lien) {
        await updateDoc(listingDoc.ref, { lienCatalogue: lien });
        console.log(`  ✓ ${catDoc.id} / ${slug} → ${lien}`);
      } else {
        await updateDoc(listingDoc.ref, { lienCatalogue: deleteField() });
        console.log(`  − ${catDoc.id} / ${slug} (bouton retiré)`);
      }
      updated += 1;
    }
  }

  console.log(`\n${updated} annonce(s) traitée(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

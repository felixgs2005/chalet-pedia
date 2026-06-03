/**
 * Seed Firestore à partir de src/data/chalets.js, ventes.js et services.js
 * Modèle : Plan_base_de_donnees_chalet (4).docx
 *
 * Usage : npm run seed:firestore
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { initializeApp } from "firebase/app";
import { initializeFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  buildEquipementsReferentiel,
  collectProprietaires,
  mapChaletToFirestore,
  mapServiceCategoryToFirestore,
  mapServiceListingToFirestore,
  mapVenteToFirestore,
  slugifyOwnerId,
} from "./seedMappers.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(rootDir, ".env");
  if (!fs.existsSync(envPath)) {
    throw new Error("Fichier .env introuvable à la racine du projet.");
  }

  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

async function loadSiteData() {
  const dataDir = path.join(rootDir, "src", "data");
  const [{ chalets }, { ventes }, { serviceCategories }] = await Promise.all([
    import(pathToFileURL(path.join(dataDir, "chalets.js")).href),
    import(pathToFileURL(path.join(dataDir, "ventes.js")).href),
    import(pathToFileURL(path.join(dataDir, "services.js")).href),
  ]);
  return { chalets, ventes, serviceCategories };
}

async function seedFirestore() {
  const env = loadEnvFile();
  const firebaseConfig = {
    apiKey: env.REACT_APP_FIREBASE_API_KEY,
    authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.REACT_APP_FIREBASE_APP_ID,
    measurementId: env.REACT_APP_FIREBASE_MEASUREMENT_ID,
  };

  const missing = Object.entries(firebaseConfig)
    .filter(([key, value]) => key !== "measurementId" && !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Variables Firebase manquantes dans .env : ${missing.join(", ")}`);
  }

  const { chalets, ventes, serviceCategories } = await loadSiteData();
  const app = initializeApp(firebaseConfig);
  const db = initializeFirestore(app, { experimentalForceLongPolling: true });
  const createdAt = serverTimestamp();

  console.log(`Projet Firebase : ${firebaseConfig.projectId}`);
  console.log(
    `Données locales : ${chalets.length} chalets, ${ventes.length} ventes, ${serviceCategories.length} catégories de services\n`
  );

  async function writeDoc(ref, data, label) {
    try {
      await setDoc(ref, data);
      console.log(`✓ ${label}`);
    } catch (error) {
      if (String(error?.message || error).includes("NOT_FOUND")) {
        throw new Error(
          "Firestore n'est pas activé sur ce projet. " +
            "Allez dans Firebase Console → Firestore Database → Créer une base de données, " +
            "puis relancez : npm run seed:firestore"
        );
      }
      throw error;
    }
  }

  const owners = collectProprietaires(chalets, createdAt);
  const defaultOwnerId = [...owners.keys()][0];

  for (const [ownerId, ownerData] of owners) {
    await writeDoc(doc(db, "users", ownerId), ownerData, `users / ${ownerId}`);
  }

  const equipements = buildEquipementsReferentiel(chalets);
  for (const equipement of equipements) {
    const { id, ...data } = equipement;
    await writeDoc(doc(db, "equipements", id), data, `equipements / ${id}`);
  }

  for (const chalet of chalets) {
    const chaletId = chalet.id || chalet.slug;
    const proprietaireId = chalet.proprietaire
      ? slugifyOwnerId(chalet.proprietaire)
      : defaultOwnerId;

    await writeDoc(
      doc(db, "chalets", chaletId),
      mapChaletToFirestore(chalet, proprietaireId, createdAt),
      `chalets / ${chaletId}`
    );
  }

  for (const vente of ventes) {
    const venteId = vente.slug || String(vente.id);
    await writeDoc(
      doc(db, "ventes", venteId),
      mapVenteToFirestore(vente, defaultOwnerId, createdAt),
      `ventes / ${venteId}`
    );
  }

  for (const category of serviceCategories) {
    await writeDoc(
      doc(db, "categorieServices", category.slug),
      mapServiceCategoryToFirestore(category, createdAt),
      `categorieServices / ${category.slug}`
    );

    for (const listing of category.listings || []) {
      await writeDoc(
        doc(db, "categorieServices", category.slug, "annoncesService", listing.slug),
        mapServiceListingToFirestore(listing, createdAt),
        `categorieServices / ${category.slug} / annoncesService / ${listing.slug}`
      );
    }
  }

  const totalListings = serviceCategories.reduce(
    (sum, category) => sum + (category.listings?.length || 0),
    0
  );

  console.log("\nTerminé — import Firestore :");
  console.log(`  • ${owners.size} utilisateurs (propriétaires)`);
  console.log(`  • ${equipements.length} équipements`);
  console.log(`  • ${chalets.length} chalets`);
  console.log(`  • ${ventes.length} ventes`);
  console.log(`  • ${serviceCategories.length} catégories de services`);
  console.log(`  • ${totalListings} annonces de services`);
  process.exit(0);
}

seedFirestore().catch((err) => {
  console.error("\nErreur lors du seed Firestore :", err.message || err);
  process.exit(1);
});

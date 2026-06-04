/**
 * Importe les données de src/data/*.js vers Firestore.
 * Prérequis : .env avec REACT_APP_FIREBASE_* et règles Firestore autorisant l'écriture (mode test ou admin).
 *
 * Usage : node scripts/seed-firestore.mjs
 */
import { readFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { initializeApp } from "firebase/app";
import {
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function loadEnv() {
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

if (!config.projectId || !config.apiKey) {
  console.error("Définissez REACT_APP_FIREBASE_PROJECT_ID et REACT_APP_FIREBASE_API_KEY dans .env");
  process.exit(1);
}

const app = initializeApp(config);
const db = getFirestore(app);

async function importData() {
  const { chalets } = await import(pathToFileURL(join(root, "src/data/chalets.js")).href);
  const { ventes } = await import(pathToFileURL(join(root, "src/data/ventes.js")).href);
  const { serviceCategories } = await import(
    pathToFileURL(join(root, "src/data/services.js")).href
  );
  const { articles } = await import(pathToFileURL(join(root, "src/data/articles.js")).href);
  const { isAstuceSlug } = await import(pathToFileURL(join(root, "src/data/astuces.js")).href);

  console.log("Import chalets…");
  for (const c of chalets) {
    await setDoc(doc(db, "chalets", c.slug), {
      slug: c.slug,
      nom: c.nom,
      sous_titre: c.sousTitre ?? "",
      region: c.region,
      region_label: c.regionLabel,
      localisation: c.localisation,
      invites: c.invites,
      chambres: c.chambres,
      sdb: c.sdb,
      prix_nuit: c.prixNuit,
      badge: c.badge,
      date_ajout: c.dateAjout,
      description: c.description,
      description_en: c.descriptionEn ?? "",
      citq: c.citq,
      images: c.images ?? [],
      features: c.caracteristiques ?? [],
      proprietaire: c.proprietaire ?? null,
      tags: c.tags ?? [],
      coordonnees: c.coordonnees ?? null,
      status: "published",
      published_at: serverTimestamp(),
    });
  }

  console.log("Import ventes…");
  for (const v of ventes) {
    await setDoc(doc(db, "ventes", v.slug), {
      slug: v.slug,
      region: v.region,
      region_badge: v.regionBadge,
      nom: v.nom,
      titre: v.titre,
      localisation: v.localisation,
      chambres: v.chambres,
      sdb: v.sdb,
      garages: v.garages,
      etages: v.etages,
      prix: v.prix,
      annonce_id: v.annonceId,
      card_image: v.cardImage,
      description_titre: v.descriptionTitre,
      description_html: v.descriptionHtml,
      images: v.images ?? [],
      features: v.features ?? [],
      price_features: v.priceFeatures ?? [],
      status: "published",
      published_at: serverTimestamp(),
    });
  }

  console.log("Import services…");
  let order = 0;
  for (const cat of serviceCategories) {
    await setDoc(doc(db, "service_categories", cat.slug), {
      slug: cat.slug,
      nom: cat.nom,
      description: cat.description,
      tagline: cat.tagline,
      image_hero: cat.image,
      href: cat.href,
      sort_order: order++,
    });

    for (const listing of cat.listings ?? []) {
      const description =
        listing.description ??
        [
          ...(listing.accroche ? [{ p: listing.accroche }] : []),
          ...(listing.intro ? [{ p: listing.intro }] : []),
          ...(listing.services
            ? [{ h: "Services" }, { ul: listing.services }]
            : []),
        ];

      await setDoc(
        doc(db, "service_categories", cat.slug, "service_listings", listing.slug),
        {
          slug: listing.slug,
          titre: listing.titre,
          localisation: listing.localisation,
          date: listing.date,
          numero: String(listing.numero ?? ""),
          image: listing.image,
          images: listing.images ?? [],
          accroche: listing.accroche ?? null,
          intro: listing.intro ?? null,
          services: listing.services ?? null,
          description,
          carte: listing.carte ?? listing.localisation,
          status: "published",
          published_at: serverTimestamp(),
        }
      );
    }
  }

  console.log("Import articles…");
  for (const a of articles) {
    await setDoc(doc(db, "articles", a.slug), {
      slug: a.slug,
      section: isAstuceSlug(a.slug) ? "astuce" : "blogue",
      titre: a.titre,
      excerpt: a.excerpt,
      filtre: a.filtre,
      tag: a.tag,
      categorie: a.categorie,
      partner: Boolean(a.partner),
      featured: Boolean(a.featured),
      date: a.date,
      date_full: a.dateFull,
      lecture: a.lecture,
      lecture_full: a.lectureFull,
      auteur: a.auteur,
      auteur_initiales: a.auteurInitiales,
      badge: a.badge,
      badge_type: a.badgeType,
      breadcrumb: a.breadcrumb,
      image: a.image,
      hero_image: a.heroImage,
      hero_alt: a.heroAlt,
      hero_caption: a.heroCaption,
      contenu_html: a.contenuHtml,
      status: "published",
      published_at: serverTimestamp(),
    });
  }

  console.log("Terminé.");
  console.log(`  ${chalets.length} chalets, ${ventes.length} ventes, ${articles.length} articles`);
}

importData().catch((err) => {
  console.error(err);
  process.exit(1);
});

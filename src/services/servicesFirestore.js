import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import {
  extractLegacyFieldsFromDescription,
  mapDescriptionBlocksFromFirestore,
  normalizeDescriptionArray,
} from "../utils/serviceDescription";
import { resolveServiceImages } from "../utils/serviceImages";

function isListingPublished(data) {
  const statut = data.statut ?? data.status;
  if (!statut) return true;
  const s = String(statut).toLowerCase();
  return s === "publié" || s === "publie" || s === "published";
}

/** Annonce (sous-collection annoncesService) → format UI. */
export function mapFirestoreServiceListing(docSnap) {
  const data = docSnap.data();
  const images = resolveServiceImages({
    image: data.image || data.imageHero || data.image_hero,
    images: data.images,
  });
  const rawDescription = normalizeDescriptionArray(data.description);
  const extracted = extractLegacyFieldsFromDescription(rawDescription);

  return {
    slug: data.slug || docSnap.id,
    titre: data.titre || "",
    localisation: data.localisation || "",
    date: data.datePublication || data.date || "",
    numero: data.numero != null && data.numero !== "" ? String(data.numero) : "",
    image: images[0] || "",
    images,
    carte: data.carte || data.localisation || "",
    description: mapDescriptionBlocksFromFirestore(rawDescription),
    accroche: data.accroche || extracted.accroche || "",
    intro: data.intro || extracted.intro || "",
    services: data.services || extracted.services || null,
    nomEntreprise: data.nomEntreprise || "",
    courrielContact: data.courrielContact || "",
    telephoneContact: data.telephoneContact || "",
    adresseContact: data.adresseContact || "",
    statut: data.statut || "",
    note: data.note > 0 ? data.note : null,
    nbAvis: data.nombreAvis ?? 0,
  };
}

/** Catégorie + annonces embarquées → format UI (comme services.js). */
export function mapFirestoreServiceCategory(docSnap, listings = []) {
  const data = docSnap.data();
  const slug = data.slug || docSnap.id;
  const published = listings.filter((l) => l);

  return {
    slug,
    nom: data.nom || "",
    description: data.description || "",
    tagline: data.tagline || "",
    image: data.imageHero || data.image_hero || data.image || "",
    href: `/chalets/${slug}/`,
    annonceCount: published.length || data.annonceCount || 0,
    listings: published,
  };
}

export async function fetchServiceCategoriesFromFirestore() {
  const snapshot = await getDocs(collection(db, "categorieServices"));
  const categories = await Promise.all(
    snapshot.docs.map(async (catDoc) => {
      const listingsSnap = await getDocs(
        collection(db, "categorieServices", catDoc.id, "annoncesService")
      );
      const listings = listingsSnap.docs
        .filter((d) => isListingPublished(d.data()))
        .map(mapFirestoreServiceListing);
      return mapFirestoreServiceCategory(catDoc, listings);
    })
  );

  return categories.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
}

export async function fetchServiceCategoryFromFirestore(categorySlug) {
  if (!categorySlug) return null;

  const catRef = doc(db, "categorieServices", categorySlug);
  const catSnap = await getDoc(catRef);
  if (!catSnap.exists()) {
    const all = await fetchServiceCategoriesFromFirestore();
    return all.find((c) => c.slug === categorySlug) ?? null;
  }

  const listingsSnap = await getDocs(
    collection(db, "categorieServices", categorySlug, "annoncesService")
  );
  const listings = listingsSnap.docs
    .filter((d) => isListingPublished(d.data()))
    .map(mapFirestoreServiceListing);

  return mapFirestoreServiceCategory(catSnap, listings);
}

export async function fetchServiceListingBySlugFromFirestore(categorySlug, listingSlug) {
  if (!categorySlug || !listingSlug) return null;

  const listingRef = doc(
    db,
    "categorieServices",
    categorySlug,
    "annoncesService",
    listingSlug
  );
  const listingSnap = await getDoc(listingRef);
  if (listingSnap.exists() && isListingPublished(listingSnap.data())) {
    const listing = mapFirestoreServiceListing(listingSnap);
    const catSnap = await getDoc(doc(db, "categorieServices", categorySlug));
    if (catSnap.exists()) {
      listing.categorieSlug = categorySlug;
      listing.categorieNom = catSnap.data().nom || "";
    }
    return listing;
  }

  const category = await fetchServiceCategoryFromFirestore(categorySlug);
  const found = category?.listings?.find((l) => l.slug === listingSlug);
  if (!found) return null;
  return {
    ...found,
    categorieSlug: categorySlug,
    categorieNom: category.nom,
  };
}

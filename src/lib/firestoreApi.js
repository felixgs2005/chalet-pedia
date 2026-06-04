import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { isFirebaseConfigured } from "./firebaseConfigured";
import {
  mapArticleDoc,
  mapChaletDoc,
  mapServiceCategoryDoc,
  mapServiceListingDoc,
  mapVenteDoc,
} from "./firestoreMappers";

async function safeQuery(run) {
  if (!isFirebaseConfigured || !db) return null;
  try {
    return await run();
  } catch (err) {
    console.warn("[ChaletPedia Firestore]", err.message);
    return null;
  }
}

export async function fetchPublishedChalets() {
  return safeQuery(async () => {
    const q = query(collection(db, "chalets"), where("status", "==", "published"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapChaletDoc(d.id, d.data()));
  });
}

export async function fetchChaletBySlug(slug) {
  return safeQuery(async () => {
    const ref = doc(db, "chalets", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status && data.status !== "published") return null;
    return mapChaletDoc(snap.id, data);
  });
}

export async function fetchPublishedVentes() {
  return safeQuery(async () => {
    const q = query(collection(db, "ventes"), where("status", "==", "published"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => mapVenteDoc(d.id, d.data()));
  });
}

export async function fetchVenteBySlug(slug) {
  return safeQuery(async () => {
    const ref = doc(db, "ventes", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status && data.status !== "published") return null;
    return mapVenteDoc(snap.id, data);
  });
}

export async function fetchServiceCatalog() {
  return safeQuery(async () => {
    const catSnap = await getDocs(collection(db, "service_categories"));
    const categories = await Promise.all(
      catSnap.docs.map(async (catDoc) => {
        const catData = catDoc.data();
        const listingsSnap = await getDocs(
          collection(db, "service_categories", catDoc.id, "service_listings")
        );
        const categoryMeta = {
          slug: catData.slug ?? catDoc.id,
          nom: catData.nom ?? "",
        };
        const listings = listingsSnap.docs
          .map((d) => {
            const data = d.data();
            if (data.status && data.status !== "published") return null;
            return mapServiceListingDoc(d.id, data, categoryMeta);
          })
          .filter(Boolean);
        listings.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        return mapServiceCategoryDoc(catDoc.id, catData, listings);
      })
    );
    categories.sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.nom.localeCompare(b.nom, "fr")
    );
    return categories;
  });
}

export async function fetchServiceListing(categorySlug, listingSlug) {
  return safeQuery(async () => {
    const catRef = doc(db, "service_categories", categorySlug);
    const catSnap = await getDoc(catRef);
    if (!catSnap.exists()) return null;

    const catData = catSnap.data();
    const listingRef = doc(
      db,
      "service_categories",
      categorySlug,
      "service_listings",
      listingSlug
    );
    const listingSnap = await getDoc(listingRef);
    if (!listingSnap.exists()) return null;

    const listingData = listingSnap.data();
    if (listingData.status && listingData.status !== "published") return null;

    return mapServiceListingDoc(listingSnap.id, listingData, {
      slug: catData.slug ?? categorySlug,
      nom: catData.nom ?? "",
    });
  });
}

export async function fetchPublishedArticles(section) {
  return safeQuery(async () => {
    const col = collection(db, "articles");
    const q = section
      ? query(col, where("section", "==", section), where("status", "==", "published"))
      : query(col, where("status", "==", "published"));
    const snap = await getDocs(q);
    const items = snap.docs.map((d, i) => ({
      ...mapArticleDoc(d.id, d.data()),
      id: i + 1,
    }));
    return items;
  });
}

export async function fetchArticleBySlug(slug) {
  return safeQuery(async () => {
    const ref = doc(db, "articles", slug);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    if (data.status && data.status !== "published") return null;
    return { ...mapArticleDoc(snap.id, data), id: 1 };
  });
}

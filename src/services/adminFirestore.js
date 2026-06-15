import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  isListingPending,
  isListingPublished,
  isListingRejected,
} from "../utils/listingStatut";

export async function fetchAllListingsForAdmin() {
  const [chaletsSnap, ventesSnap, servicesSnap] = await Promise.all([
    getDocs(collection(db, "chalets")),
    getDocs(collection(db, "ventes")),
    getDocs(collectionGroup(db, "annoncesService")),
  ]);

  const chalets = chaletsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    _collection: "chalets",
  }));
  const ventes = ventesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    _collection: "ventes",
  }));
  const services = servicesSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    _collection: "services",
    categorySlug: d.ref.parent.parent?.id || "",
  }));

  return [...chalets, ...ventes, ...services];
}

/** @deprecated Utiliser fetchAllListingsForAdmin */
export const fetchAllChalets = fetchAllListingsForAdmin;

export function filterPublishedListings(listings) {
  return listings.filter((item) => isListingPublished(item));
}

export function filterPendingListings(listings) {
  return listings.filter((item) => isListingPending(item));
}

export function filterRejectedListings(listings) {
  return listings.filter((item) => isListingRejected(item));
}

export function getListingPublicPath(item) {
  const slug = item.slug || item.id;
  if (item._collection === "ventes") {
    return `/chalets/chalets-a-vendre/${slug}`;
  }
  if (item._collection === "services" && item.categorySlug) {
    return `/chalets/${item.categorySlug}/${slug}`;
  }
  return `/chalet/${slug}`;
}

function listingDocRef(collectionName, slug, categorySlug) {
  if (collectionName === "services") {
    if (!categorySlug) throw new Error("Catégorie service manquante.");
    return doc(db, "categorieServices", categorySlug, "annoncesService", slug);
  }
  return doc(db, collectionName, slug);
}

export async function approveListing(collectionName, slug, categorySlug) {
  const ref = listingDocRef(collectionName, slug, categorySlug);
  await updateDoc(ref, { statut: "publié", datePublication: serverTimestamp() });
}

export async function rejectListing(collectionName, slug, categorySlug) {
  const ref = listingDocRef(collectionName, slug, categorySlug);
  await updateDoc(ref, { statut: "rejeté", dateRefus: serverTimestamp() });
}

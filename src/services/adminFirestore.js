import {
  collection,
  collectionGroup,
  deleteDoc,
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
import { resolveListingImages } from "../utils/serviceImages";
import { mapFirestoreServiceListing } from "./servicesFirestore";

function mapChaletOrVenteForAdmin(d, collectionName) {
  const data = d.data();
  const item = { ...data, _collection: collectionName, id: d.id };
  const images = resolveListingImages(item);
  return {
    ...item,
    ...(images.length ? { images, image: images[0] } : {}),
  };
}

function mapServiceForAdmin(d) {
  const categorySlug = d.ref.parent.parent?.id || "";
  const mapped = mapFirestoreServiceListing(d);

  return {
    ...d.data(),
    ...mapped,
    _collection: "services",
    categorySlug,
    id: d.id,
  };
}

export async function fetchAllListingsForAdmin() {
  const [chaletsSnap, ventesSnap, servicesSnap] = await Promise.all([
    getDocs(collection(db, "chalets")),
    getDocs(collection(db, "ventes")),
    getDocs(collectionGroup(db, "annoncesService")),
  ]);

  const chalets = chaletsSnap.docs.map((d) => mapChaletOrVenteForAdmin(d, "chalets"));
  const ventes = ventesSnap.docs.map((d) => mapChaletOrVenteForAdmin(d, "ventes"));
  const services = servicesSnap.docs.map((d) => mapServiceForAdmin(d));

  return [...chalets, ...ventes, ...services];
}

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

function listingDocRef(item) {
  const docId = item?.id;
  if (!docId) throw new Error("Identifiant Firestore manquant.");

  if (item._collection === "services") {
    if (!item.categorySlug) throw new Error("Catégorie service manquante.");
    return doc(db, "categorieServices", item.categorySlug, "annoncesService", docId);
  }

  return doc(db, item._collection, docId);
}

export async function approveListing(item) {
  const ref = listingDocRef(item);
  await updateDoc(ref, { statut: "publié", datePublication: serverTimestamp() });
}

export async function rejectListing(item) {
  const ref = listingDocRef(item);
  await updateDoc(ref, { statut: "rejeté", dateRefus: serverTimestamp() });
}

export async function deleteListing(item) {
  const ref = listingDocRef(item);
  await deleteDoc(ref);
}

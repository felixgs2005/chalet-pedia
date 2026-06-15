import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import {
  isListingPending,
  isListingPublished,
  isListingRejected,
} from "../utils/listingStatut";

export async function fetchAllListingsForAdmin() {
  const chaletsSnap = await getDocs(collection(db, "chalets"));
  const ventesSnap = await getDocs(collection(db, "ventes"));

  const chalets = chaletsSnap.docs.map((d) => ({ id: d.id, ...d.data(), _collection: "chalets" }));
  const ventes = ventesSnap.docs.map((d) => ({ id: d.id, ...d.data(), _collection: "ventes" }));

  return [...chalets, ...ventes];
}

/** @deprecated Utiliser fetchAllListingsForAdmin */
export const fetchAllChalets = fetchAllListingsForAdmin;

export function filterPublishedListings(listings) {
  return listings.filter((item) => isListingPublished(item.statut));
}

export function filterPendingListings(listings) {
  return listings.filter((item) => isListingPending(item.statut));
}

export function filterRejectedListings(listings) {
  return listings.filter((item) => isListingRejected(item.statut));
}

export function getListingPublicPath(item) {
  const slug = item.slug || item.id;
  if (item._collection === "ventes") {
    return `/chalets/chalets-a-vendre/${slug}`;
  }
  return `/chalet/${slug}`;
}

export async function approveListing(collectionName, slug) {
  const ref = doc(db, collectionName, slug);
  await updateDoc(ref, { statut: "publié", datePublication: serverTimestamp() });
}

export async function rejectListing(collectionName, slug) {
  const ref = doc(db, collectionName, slug);
  await updateDoc(ref, { statut: "rejeté", dateRefus: serverTimestamp() });
}

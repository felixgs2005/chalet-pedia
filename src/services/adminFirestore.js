import {
  collection,
  collectionGroup,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export async function fetchAllChalets() {
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

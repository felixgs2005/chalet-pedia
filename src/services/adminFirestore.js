import { collection, getDocs, doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function fetchAllChalets() {
  const chaletsSnap = await getDocs(collection(db, "chalets"));
  const ventesSnap = await getDocs(collection(db, "ventes"));

  const chalets = chaletsSnap.docs.map((d) => ({ id: d.id, ...d.data(), _collection: "chalets" }));
  const ventes = ventesSnap.docs.map((d) => ({ id: d.id, ...d.data(), _collection: "ventes" }));

  return [...chalets, ...ventes];
}

export async function approveListing(collectionName, slug) {
  const ref = doc(db, collectionName, slug);
  await updateDoc(ref, { statut: "publié", datePublication: serverTimestamp() });
}

export async function rejectListing(collectionName, slug) {
  const ref = doc(db, collectionName, slug);
  await updateDoc(ref, { statut: "rejeté", dateRefus: serverTimestamp() });
}

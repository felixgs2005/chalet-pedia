import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
/** Convertit un document Firestore (plan Word) vers le format utilisé par l'UI. */
export function mapFirestoreVente(docSnap) {
  const data = docSnap.data();
  const images = data.images?.length ? data.images : [];
  const rawId = data.sourceId ?? docSnap.id;

  return {
    id: Number.isNaN(Number(rawId)) ? rawId : Number(rawId),
    slug: data.slug || docSnap.id,
    region: data.region || "",
    regionBadge: data.regionBadge || (data.region || "").toUpperCase(),
    nom: data.nom || "",
    titre: data.titre || data.nom || "",
    localisation: data.localisation || "",
    chambres: data.nombreChambres ?? null,
    sdb: data.nombreSallesBain ?? null,
    garages: data.garages ?? null,
    etages: data.etages ?? null,
    prix: data.prix || "",
    annonceId: data.annonceId || "",
    cardImage: images[0] || "",
    images,
    descriptionTitre: data.descriptionTitre || "",
    descriptionHtml: data.descriptionHtml || "",
    features: (data.caracteristiques || []).map((block) => ({
      titre: block.titre,
      icon: block.icon || "",
      items: block.items || [],
    })),
    priceFeatures: (data.descriptionPrix || []).map((item) => ({
      label: item.label,
      value: item.valeur ?? item.value ?? "",
    })),
    proprietaireId: data.proprietaireId || "",
  };
}

export async function fetchVentesFromFirestore() {
  const snapshot = await getDocs(collection(db, "ventes"));
  return snapshot.docs.map(mapFirestoreVente);
}

export async function fetchVenteBySlugFromFirestore(slug) {
  if (!slug) return null;

  const docRef = doc(db, "ventes", slug);
  const snapshot = await getDoc(docRef);
  if (snapshot.exists()) {
    return mapFirestoreVente(snapshot);
  }

  const all = await fetchVentesFromFirestore();
  return all.find((vente) => vente.slug === slug) ?? null;
}
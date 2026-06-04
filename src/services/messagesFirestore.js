import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "../firebase";
import { resolveUtilisateur, resolveUtilisateurByUid } from "../utils/resolveUtilisateur";

export function buildConversationKey(typeEntite, entiteId, uidA, uidB) {
  const ids = [uidA, uidB].filter(Boolean).sort();
  return `${typeEntite}_${entiteId}_${ids.join("_")}`;
}

export function formatMessageDate(timestamp) {
  if (!timestamp) return "";
  const date =
    typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("fr-CA", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function mapFirestoreMessage(docSnap) {
  const data = docSnap.data();
  const expediteur = data.expediteur || {};
  const destinataire = data.destinataire || {};

  return {
    id: docSnap.id,
    conversationKey: data.conversationKey,
    typeEntite: data.typeEntite,
    entiteId: data.entiteId,
    entiteTitre: data.entiteTitre || "",
    entiteUrl: data.entiteUrl || "",
    texte: data.texte || "",
    pieceJointeUrl: data.pieceJointeUrl || null,
    pieceJointeNom: data.pieceJointeNom || null,
    expediteur: {
      uid: expediteur.uid || "",
      displayName: expediteur.displayName || "Utilisateur",
    },
    destinataire: {
      uid: destinataire.uid || "",
      displayName: destinataire.displayName || "Annonceur",
    },
    participantUids: data.participantUids || [],
    dateEnvoi: data.dateEnvoi,
    dateLabel: formatMessageDate(data.dateEnvoi),
  };
}

export function buildChaletMessageCible(chalet) {
  if (!chalet) return null;
  return {
    typeEntite: "chalet",
    entiteId: chalet.slug,
    entiteTitre: chalet.nom,
    entiteUrl: `/chalet/${chalet.slug}`,
    destinataireUid: chalet.proprietaireId || "",
    destinataireNom: chalet.proprietaire?.nom || "Propriétaire",
  };
}

export function buildServiceMessageCible(listing) {
  if (!listing?.categorieSlug || !listing?.slug) return null;
  return {
    typeEntite: "service",
    entiteId: listing.slug,
    entiteTitre: listing.titre,
    entiteUrl: `/chalets/${listing.categorieSlug}/${listing.slug}`,
    destinataireUid: listing.proprietaireId || "",
    destinataireNom: listing.nomEntreprise || "Annonceur",
  };
}

export function buildVenteMessageCible(vente) {
  if (!vente?.slug) return null;
  return {
    typeEntite: "vente",
    entiteId: vente.slug,
    entiteTitre: vente.titre || vente.nom,
    entiteUrl: `/chalets/chalets-a-vendre/${vente.slug}`,
    destinataireUid: vente.proprietaireId || "",
    destinataireNom: "Propriétaire",
  };
}

async function uploadMessageAttachment(uid, file) {
  const storageRef = ref(storage, `messages/${uid}/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/** Enregistre un message dans la collection `messages`. */
export async function sendMessage(cible, { texte, utilisateur, fichier }) {
  if (!cible?.typeEntite || !cible?.entiteId) {
    throw new Error("Annonce introuvable.");
  }
  const trimmed = texte?.trim();
  if (!trimmed) {
    throw new Error("Veuillez écrire un message.");
  }

  const expediteur = await resolveUtilisateur(utilisateur);

  if (cible.destinataireUid && cible.destinataireUid === expediteur.uid) {
    throw new Error("Vous ne pouvez pas vous envoyer un message à vous-même.");
  }

  const destinataire = cible.destinataireUid
    ? await resolveUtilisateurByUid(cible.destinataireUid)
    : {
        uid: cible.destinataireUid || "",
        displayName: cible.destinataireNom || "Annonceur",
        email: null,
        prenom: null,
        nom: null,
      };

  const participantUids = [expediteur.uid, destinataire.uid].filter(Boolean);
  const conversationKey = buildConversationKey(
    cible.typeEntite,
    cible.entiteId,
    expediteur.uid,
    destinataire.uid
  );

  let pieceJointeUrl = null;
  let pieceJointeNom = null;
  if (fichier) {
    pieceJointeUrl = await uploadMessageAttachment(expediteur.uid, fichier);
    pieceJointeNom = fichier.name;
  }

  await addDoc(collection(db, "messages"), {
    conversationKey,
    typeEntite: cible.typeEntite,
    entiteId: cible.entiteId,
    entiteTitre: cible.entiteTitre || "",
    entiteUrl: cible.entiteUrl || "",
    texte: trimmed,
    expediteur,
    destinataire,
    participantUids,
    pieceJointeUrl,
    pieceJointeNom,
    dateEnvoi: serverTimestamp(),
  });

  return { conversationKey };
}

export async function fetchMessagesForUser(utilisateurUid) {
  if (!utilisateurUid) return [];

  const q = query(
    collection(db, "messages"),
    where("participantUids", "array-contains", utilisateurUid)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(mapFirestoreMessage);
}

export function groupMessageThreads(messages, currentUid) {
  const byKey = new Map();

  messages.forEach((msg) => {
    const key = msg.conversationKey;
    const existing = byKey.get(key);
    const msgTime = msg.dateEnvoi?.toMillis?.() ?? 0;

    const other =
      msg.expediteur.uid === currentUid ? msg.destinataire : msg.expediteur;

    if (!existing || msgTime > (existing.lastMessage?.dateEnvoi?.toMillis?.() ?? 0)) {
      byKey.set(key, {
        conversationKey: key,
        otherName: other.displayName,
        entiteTitre: msg.entiteTitre,
        entiteUrl: msg.entiteUrl,
        lastMessage: msg,
        dateLabel: msg.dateLabel,
      });
    }
  });

  return Array.from(byKey.values()).sort((a, b) => {
    const ta = a.lastMessage?.dateEnvoi?.toMillis?.() ?? 0;
    const tb = b.lastMessage?.dateEnvoi?.toMillis?.() ?? 0;
    return tb - ta;
  });
}

export async function fetchMessagesForConversation(conversationKey, utilisateurUid) {
  if (!conversationKey || !utilisateurUid) return [];

  const q = query(
    collection(db, "messages"),
    where("conversationKey", "==", conversationKey),
    where("participantUids", "array-contains", utilisateurUid)
  );
  const snapshot = await getDocs(q);
  const list = snapshot.docs.map(mapFirestoreMessage);
  list.sort((a, b) => {
    const ta = a.dateEnvoi?.toMillis?.() ?? 0;
    const tb = b.dateEnvoi?.toMillis?.() ?? 0;
    return ta - tb;
  });
  return list;
}

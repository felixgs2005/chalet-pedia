import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

/** Retire guillemets éventuels copiés depuis la console Firebase. */
function env(name) {
  const raw = process.env[name];
  if (raw == null) return "";
  return String(raw).trim().replace(/^["']|["']$/g, "");
}

const storageBucket = env("REACT_APP_FIREBASE_STORAGE_BUCKET");

const firebaseConfig = {
  apiKey: env("REACT_APP_FIREBASE_API_KEY"),
  authDomain: env("REACT_APP_FIREBASE_AUTH_DOMAIN"),
  projectId: env("REACT_APP_FIREBASE_PROJECT_ID"),
  storageBucket,
  messagingSenderId: env("REACT_APP_FIREBASE_MESSAGING_SENDER_ID"),
  appId: env("REACT_APP_FIREBASE_APP_ID"),
  measurementId: env("REACT_APP_FIREBASE_MEASUREMENT_ID"),
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

/** Bucket explicite — évite les uploads qui restent bloqués si le bucket par défaut est incorrect. */
export const storage = storageBucket
  ? getStorage(app, `gs://${storageBucket}`)
  : getStorage(app);

export const storageBucketName = storageBucket;

isSupported().then((ok) => {
  if (ok) getAnalytics(app);
});

export default app;

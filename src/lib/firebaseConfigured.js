/** True si les variables REACT_APP_FIREBASE_* minimales sont définies. */
export const isFirebaseConfigured = Boolean(
  process.env.REACT_APP_FIREBASE_API_KEY &&
    process.env.REACT_APP_FIREBASE_PROJECT_ID
);

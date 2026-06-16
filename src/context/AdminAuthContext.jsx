import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  ADMIN_EMAIL,
  clearAdminSession,
  isAdminFirebaseUser,
  normalizeAdminEmail,
  readAdminSession,
  verifyAdminCredentials,
  writeAdminSession,
} from "../config/adminAuth";
import { removeLegacyUserRole } from "../services/userProfileFirestore";

const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

function resolveAdminAuthenticated(user) {
  if (!isAdminFirebaseUser(user)) return false;
  return readAdminSession();
}

export function AdminAuthProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncAdminAuthState = useCallback((user) => {
    if (!isAdminFirebaseUser(user)) {
      clearAdminSession();
      setIsAdminAuthenticated(false);
      return;
    }
    setIsAdminAuthenticated(resolveAdminAuthenticated(user));
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      syncAdminAuthState(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [syncAdminAuthState]);

  const login = useCallback(async (email, password) => {
    const valid = await verifyAdminCredentials(email, password);
    if (!valid) {
      throw new Error("Courriel ou mot de passe incorrect.");
    }

    const credential = await signInWithEmailAndPassword(
      auth,
      normalizeAdminEmail(ADMIN_EMAIL),
      password
    );
    writeAdminSession();
    setIsAdminAuthenticated(true);

    removeLegacyUserRole(credential.user.uid).catch((err) => {
      console.error("removeLegacyUserRole:", err);
    });
  }, []);

  /** Déconnexion globale : session admin + Firebase Auth (utilisateurs et admin). */
  const logout = useCallback(async () => {
    clearAdminSession();
    setIsAdminAuthenticated(false);
    if (auth.currentUser) {
      await signOut(auth);
    }
  }, []);

  const value = {
    isAdminAuthenticated,
    loading,
    login,
    logout,
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

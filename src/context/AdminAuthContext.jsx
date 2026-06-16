import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../firebase";
import {
  ADMIN_EMAIL,
  clearAdminSession,
  normalizeAdminEmail,
  readAdminSession,
  verifyAdminCredentials,
  writeAdminSession,
} from "../config/adminAuth";

const AdminAuthContext = createContext(null);

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }) {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsAdminAuthenticated(readAdminSession());

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        clearAdminSession();
        setIsAdminAuthenticated(false);
        setLoading(false);
        return;
      }

      if (normalizeAdminEmail(user.email) === normalizeAdminEmail(ADMIN_EMAIL)) {
        setIsAdminAuthenticated(readAdminSession());
      }

      setLoading(false);
    });

    setLoading(false);
    return unsubscribe;
  }, []);

  const login = useCallback(async (email, password) => {
    const valid = await verifyAdminCredentials(email, password);
    if (!valid) {
      throw new Error("Courriel ou mot de passe incorrect.");
    }

    await signInWithEmailAndPassword(auth, normalizeAdminEmail(ADMIN_EMAIL), password);
    writeAdminSession();
    setIsAdminAuthenticated(true);
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

import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  fetchUserProfile,
  isAdminRole,
  syncUserCourriel,
} from "../services/userProfileFirestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user?.uid) {
        setUserProfile(null);
        setProfileLoading(false);
        setLoading(false);
        return;
      }

      setProfileLoading(true);
      try {
        const profile = await fetchUserProfile(user.uid);
        setUserProfile(profile);

        if (user.email) {
          syncUserCourriel(user.uid, user.email).catch((err) => {
            console.error("syncUserCourriel:", err);
          });
        }
      } catch (err) {
        console.error("fetchUserProfile:", err);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const role = userProfile?.role ?? null;
  const isAdmin = isAdminRole(role);

  const value = {
    currentUser,
    userProfile,
    role,
    isAdmin,
    loading,
    profileLoading,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

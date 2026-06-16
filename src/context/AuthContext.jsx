import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { syncUserCourriel } from "../services/userProfileFirestore";
import {
  hasChaletsSubscription,
  hasServicesSubscription,
} from "../utils/subscriptions";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        if (user.email) {
          await syncUserCourriel(user.uid, user.email);
        }
      } catch (err) {
        console.error("syncUserCourriel:", err);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentUser?.uid) {
      setUserProfile(null);
      setProfileLoading(false);
      return undefined;
    }

    setProfileLoading(true);
    const unsub = onSnapshot(
      doc(db, "users", currentUser.uid),
      (snap) => {
        setUserProfile(snap.exists() ? snap.data() : null);
        setProfileLoading(false);
      },
      (err) => {
        console.error("userProfile onSnapshot:", err);
        setUserProfile(null);
        setProfileLoading(false);
      }
    );

    return unsub;
  }, [currentUser?.uid]);

  const subscriptions = userProfile?.subscriptions || null;

  const subscriptionFlags = useMemo(
    () => ({
      hasChaletsSubscription: hasChaletsSubscription(subscriptions),
      hasServicesSubscription: hasServicesSubscription(subscriptions),
    }),
    [subscriptions]
  );

  const value = {
    currentUser,
    userProfile,
    subscriptions,
    profileLoading,
    loading,
    login,
    signup,
    resetPassword,
    ...subscriptionFlags,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

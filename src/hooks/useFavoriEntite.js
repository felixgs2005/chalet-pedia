import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  addFavori,
  isFavori,
  removeFavori,
} from "../services/favorisFirestore";

export function useFavoriEntite(cible) {
  const { currentUser } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [loading, setLoading] = useState(false);

  const typeEntite = cible?.typeEntite;
  const entiteId = cible?.entiteId;

  useEffect(() => {
    if (!currentUser?.uid || !typeEntite || !entiteId) {
      setFavorited(false);
      return;
    }

    let cancelled = false;
    isFavori(currentUser.uid, typeEntite, entiteId).then((value) => {
      if (!cancelled) setFavorited(value);
    });

    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid, typeEntite, entiteId]);

  const toggle = useCallback(async () => {
    if (!cible?.typeEntite || !cible?.entiteId) return;
    if (!currentUser) {
      throw new Error("Connectez-vous pour gérer vos favoris.");
    }

    setLoading(true);
    try {
      if (favorited) {
        await removeFavori(currentUser.uid, cible.typeEntite, cible.entiteId);
        setFavorited(false);
      } else {
        await addFavori(cible, currentUser);
        setFavorited(true);
      }
    } finally {
      setLoading(false);
    }
  }, [cible, currentUser, favorited]);

  return { favorited, loading, toggle, isLoggedIn: Boolean(currentUser) };
}

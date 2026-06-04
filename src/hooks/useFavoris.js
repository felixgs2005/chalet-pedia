import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchFavorisForUser } from "../services/favorisFirestore";

export function useFavoris() {
  const { currentUser } = useAuth();
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!currentUser?.uid) {
      setFavoris([]);
      setLoading(false);
      return Promise.resolve([]);
    }

    setLoading(true);
    setError(null);

    return fetchFavorisForUser(currentUser.uid)
      .then((list) => {
        setFavoris(list);
        return list;
      })
      .catch((err) => {
        setError(err);
        setFavoris([]);
        return [];
      })
      .finally(() => setLoading(false));
  }, [currentUser?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { favoris, loading, error, refresh };
}

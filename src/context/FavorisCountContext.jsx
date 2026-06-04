import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchFavorisForUser } from "../services/favorisFirestore";

const FavorisCountContext = createContext({
  count: 0,
  loading: false,
  refresh: () => Promise.resolve(0),
});

export function useFavorisCount() {
  return useContext(FavorisCountContext);
}

export function FavorisCountProvider({ children }) {
  const { currentUser } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!currentUser?.uid) {
      setCount(0);
      return 0;
    }

    setLoading(true);
    try {
      const list = await fetchFavorisForUser(currentUser.uid);
      setCount(list.length);
      return list.length;
    } catch {
      return 0;
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <FavorisCountContext.Provider value={{ count, loading, refresh }}>
      {children}
    </FavorisCountContext.Provider>
  );
}

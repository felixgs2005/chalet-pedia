import { useCallback, useEffect, useState } from "react";
import { fetchAvisForEntite } from "../services/avisFirestore";

export function useAvis(typeEntite, entiteId) {
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(() => {
    if (!typeEntite || !entiteId) {
      setAvis([]);
      setLoading(false);
      return Promise.resolve([]);
    }

    setLoading(true);
    setError(null);

    return fetchAvisForEntite(typeEntite, entiteId)
      .then((list) => {
        setAvis(list);
        return list;
      })
      .catch((err) => {
        setError(err);
        setAvis([]);
        return [];
      })
      .finally(() => setLoading(false));
  }, [typeEntite, entiteId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { avis, loading, error, refresh };
}

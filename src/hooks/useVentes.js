import { useEffect, useState } from "react";
import { fetchVentesFromFirestore } from "../services/ventesFirestore";

export function useVentes() {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchVentesFromFirestore()
      .then((data) => {
        if (!cancelled) setVentes(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ventes, loading, error };
}

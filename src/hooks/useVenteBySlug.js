import { useEffect, useState } from "react";
import { fetchVenteBySlugFromFirestore } from "../services/ventesFirestore";

export function useVenteBySlug(slug) {
  const [vente, setVente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setVente(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setVente(null);

    fetchVenteBySlugFromFirestore(slug)
      .then((data) => {
        if (!cancelled) setVente(data);
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
  }, [slug]);

  return { vente, loading, error };
}

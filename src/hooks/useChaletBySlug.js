import { useEffect, useState } from "react";
import { fetchChaletBySlugFromFirestore } from "../services/chaletsFirestore";

export function useChaletBySlug(slug) {
  const [chalet, setChalet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setChalet(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setChalet(null);

    fetchChaletBySlugFromFirestore(slug)
      .then((data) => {
        if (!cancelled) setChalet(data);
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

  return { chalet, loading, error };
}

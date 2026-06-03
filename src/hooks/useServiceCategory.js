import { useEffect, useState } from "react";
import { fetchServiceCategoryFromFirestore } from "../services/servicesFirestore";

export function useServiceCategory(categorySlug) {
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categorySlug) {
      setCategory(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setCategory(null);

    fetchServiceCategoryFromFirestore(categorySlug)
      .then((data) => {
        if (!cancelled) setCategory(data);
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
  }, [categorySlug]);

  const listings = category?.listings ?? [];

  return { category, listings, loading, error };
}

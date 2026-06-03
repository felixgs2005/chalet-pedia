import { useEffect, useState } from "react";
import { fetchServiceListingBySlugFromFirestore } from "../services/servicesFirestore";

export function useServiceListingBySlug(categorySlug, listingSlug) {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categorySlug || !listingSlug) {
      setListing(null);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setListing(null);

    fetchServiceListingBySlugFromFirestore(categorySlug, listingSlug)
      .then((data) => {
        if (!cancelled) setListing(data);
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
  }, [categorySlug, listingSlug]);

  return { listing, loading, error };
}

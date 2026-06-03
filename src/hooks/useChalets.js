import { useEffect, useState } from "react";
import { fetchChaletsFromFirestore } from "../services/chaletsFirestore";

export function useChalets() {
  const [chalets, setChalets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    fetchChaletsFromFirestore()
      .then((data) => {
        if (!cancelled) setChalets(data);
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

  return { chalets, loading, error };
}

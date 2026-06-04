import { useEffect, useState } from "react";
import { chalets as staticChalets, getChaletBySlug as getStaticChalet } from "../data/chalets";
import { ventes as staticVentes, getVenteBySlug as getStaticVente } from "../data/ventes";
import {
  serviceCategories as staticCategories,
  getCategoryListings,
  getListing as getStaticListing,
} from "../data/services";
import {
  articles as staticArticles,
  getArticleBySlug as getStaticArticle,
  getRelatedArticles as getStaticRelated,
} from "../data/articles";
import { isAstuceSlug } from "../data/astuces";
import {
  fetchArticleBySlug,
  fetchChaletBySlug,
  fetchPublishedArticles,
  fetchPublishedChalets,
  fetchPublishedVentes,
  fetchServiceCatalog,
  fetchServiceListing,
  fetchVenteBySlug,
} from "../lib/firestoreApi";

const staticBlogueArticles = staticArticles.filter((a) => !isAstuceSlug(a.slug));

function useAsyncData(fetchFn, fallback, deps) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [fromFirestore, setFromFirestore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchFn().then((result) => {
      if (cancelled) return;
      if (result != null) {
        setData(result);
        setFromFirestore(true);
      } else {
        setData(fallback);
        setFromFirestore(false);
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, fromFirestore };
}

export function useChalets() {
  const { data, loading, fromFirestore } = useAsyncData(
    fetchPublishedChalets,
    staticChalets,
    []
  );
  return { chalets: data, loading, fromFirestore };
}

export function useChaletBySlug(slug) {
  const [chalet, setChalet] = useState(() => getStaticChalet(slug) ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchChaletBySlug(slug).then((result) => {
      if (cancelled) return;
      setChalet(result ?? getStaticChalet(slug) ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { chalet, loading };
}

export function useVentes() {
  const { data, loading, fromFirestore } = useAsyncData(
    fetchPublishedVentes,
    staticVentes,
    []
  );
  return { ventes: data, loading, fromFirestore };
}

export function useVenteBySlug(slug) {
  const [vente, setVente] = useState(() => getStaticVente(slug) ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchVenteBySlug(slug).then((result) => {
      if (cancelled) return;
      setVente(result ?? getStaticVente(slug) ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { vente, loading };
}

export function useServiceCatalog() {
  const { data, loading, fromFirestore } = useAsyncData(
    fetchServiceCatalog,
    staticCategories,
    []
  );
  return { categories: data, loading, fromFirestore };
}

export function useServiceListings(categorySlug) {
  const { categories, loading } = useServiceCatalog();
  const listings =
    categories.find((c) => c.slug === categorySlug)?.listings ??
    getCategoryListings(categorySlug);
  return { listings, loading };
}

export function useServiceListing(categorySlug, listingSlug) {
  const [listing, setListing] = useState(
    () => getStaticListing(categorySlug, listingSlug) ?? null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchServiceListing(categorySlug, listingSlug).then((result) => {
      if (cancelled) return;
      setListing(result ?? getStaticListing(categorySlug, listingSlug) ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [categorySlug, listingSlug]);

  return { listing, loading };
}

export function useBlogueArticles() {
  const { data, loading, fromFirestore } = useAsyncData(
    () => fetchPublishedArticles("blogue"),
    staticBlogueArticles,
    []
  );
  const articles = data ?? staticBlogueArticles;
  return {
    articles,
    loading,
    fromFirestore,
    getFeaturedArticle: () => articles.find((a) => a.featured) || articles[0],
    getArticlesNonFeatured: () => articles.filter((a) => !a.featured),
  };
}

export function useArticleBySlug(slug) {
  const [article, setArticle] = useState(() => getStaticArticle(slug) ?? null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchArticleBySlug(slug).then((result) => {
      if (cancelled) return;
      setArticle(result ?? getStaticArticle(slug) ?? null);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const related = getStaticRelated(slug);
  return { article, related, loading };
}

import { LISTING_REGIONS } from "./listingRegions";
import { LISTING_EXPERIENCES } from "./listingExperiences";

export const LISTING_PREFIX = "chalets-a-louer-";

/** Analyse /chalets/chalets-a-louer-laurentides/ ou /chalets/chalets-a-louer-animaux-permis/ */
export function parseListingPageSlug(pageSlug) {
  if (!pageSlug || pageSlug === "chalet-a-louer") {
    return { valid: true, regionKey: "all", experienceKey: null };
  }

  if (!pageSlug.startsWith(LISTING_PREFIX)) {
    return { valid: false, regionKey: null, experienceKey: null };
  }

  const suffix = pageSlug.slice(LISTING_PREFIX.length).replace(/\/$/, "");

  const experience = Object.values(LISTING_EXPERIENCES).find((e) => e.slug === suffix);
  if (experience) {
    return { valid: true, regionKey: "all", experienceKey: experience.key };
  }

  const region = Object.values(LISTING_REGIONS).find((r) => r.slug === suffix);
  if (region) {
    return { valid: true, regionKey: region.key, experienceKey: null };
  }

  return { valid: false, regionKey: null, experienceKey: null };
}

export function getPageSlugFromListing(regionKey, experienceKey) {
  if (experienceKey && experienceKey !== "all") {
    const exp = LISTING_EXPERIENCES[experienceKey];
    if (exp) return `${LISTING_PREFIX}${exp.slug}`;
  }
  if (!regionKey || regionKey === "all") return "chalet-a-louer";
  const region = LISTING_REGIONS[regionKey];
  if (!region?.slug) return "chalet-a-louer";
  return `${LISTING_PREFIX}${region.slug}`;
}

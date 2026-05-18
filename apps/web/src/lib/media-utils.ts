import type { Media, Trip, TripMedia } from "@workspace/api-client";

// Placeholder images for different content types
export const PLACEHOLDER_IMAGES = {
  TREK: "/placeholder-trek.jpg",
  BLOG: "/placeholder-blog.jpg",
  DESTINATION: "/placeholder-destination.jpg",
  GALLERY: "/placeholder-gallery.jpg",
  USER: "/placeholder-user.jpg",
};

/**
 * Normalizes a media URL from various API response shapes.
 * Handles both direct URL (media.url) and nested URL (media.media.url)
 */
export function normalizeMediaUrl(
  media: Partial<TripMedia> | Partial<Media> | undefined | null,
  fallback: string = PLACEHOLDER_IMAGES.TREK,
): string {
  if (!media) return fallback;

  // Handle TripMedia shape with nested media object
  if ("media" in media && media.media && typeof media.media === "object") {
    const nestedUrl = (media.media as Media).url;
    if (nestedUrl && isValidUrl(nestedUrl)) {
      return ensureHttps(nestedUrl);
    }
  }

  // Handle direct url property
  const directUrl = (media as any).url;
  if (directUrl && isValidUrl(directUrl)) {
    return ensureHttps(directUrl);
  }

  return fallback;
}

/**
 * Gets the first valid image URL from an array of media items
 */
export function getFirstMediaUrl(
  mediaItems: (TripMedia | Media)[] | undefined | null,
  fallback: string = PLACEHOLDER_IMAGES.TREK,
): string {
  if (!Array.isArray(mediaItems) || mediaItems.length === 0) {
    return fallback;
  }

  for (const item of mediaItems) {
    const url = normalizeMediaUrl(item, "");
    if (url) return url;
  }

  return fallback;
}

/**
 * Normalizes trip media by ensuring all media items have accessible URLs
 */
export function normalizeTripMedia<T extends { media?: TripMedia[] }>(trip: T): T {
  if (!trip.media || !Array.isArray(trip.media)) {
    return { ...trip, media: [] };
  }

  const normalizedMedia = trip.media.map((m) => ({
    ...m,
    url: normalizeMediaUrl(m, PLACEHOLDER_IMAGES.TREK),
  }));

  return { ...trip, media: normalizedMedia };
}

/**
 * Normalizes an array of trips' media
 */
export function normalizeTripsMedia<T extends { media?: TripMedia[] }>(
  trips: T[] | undefined | null,
): T[] {
  if (!Array.isArray(trips)) return [];
  return trips.map(normalizeTripMedia);
}

/**
 * Validates if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("/")) return true; // Relative URLs are valid
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensures URL uses HTTPS protocol (important for S3 URLs)
 */
function ensureHttps(url: string): string {
  if (url.startsWith("http://")) {
    return url.replace("http://", "https://");
  }
  return url;
}

/**
 * Gets blog featured image URL with fallback
 */
export function getBlogImageUrl(
  blog: { featuredImage?: string | null } | undefined | null,
  fallback: string = PLACEHOLDER_IMAGES.BLOG,
): string {
  if (!blog?.featuredImage) return fallback;
  return isValidUrl(blog.featuredImage) ? ensureHttps(blog.featuredImage) : fallback;
}

/**
 * Gets departure trip image URL with fallback
 */
export function getDepartureTripImageUrl(
  departure: { trip?: { media?: TripMedia[] } | null } | undefined | null,
  fallback: string = PLACEHOLDER_IMAGES.TREK,
): string {
  if (!departure?.trip?.media) return fallback;
  return getFirstMediaUrl(departure.trip.media, fallback);
}

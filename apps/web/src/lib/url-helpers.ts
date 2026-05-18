import type { TripDestination } from "@workspace/api-client";

/**
 * Minimal type for buildTripUrl - accepts any object with these fields
 */
type TripLike = {
  title: string;
  slug?: string;
  destinations?: TripDestination[];
  region?: string;
};

/**
 * Build hierarchical URL for a trip: /[country]/[destination]/[trip]
 */
export function buildTripUrl(trip: TripLike): string {
  // Check if we have destination data with hierarchy
  if (trip.destinations && trip.destinations.length > 0) {
    const tripDestination = trip.destinations[0];
    const destination = tripDestination?.destination;

    // We need a destination with a parent (country) and all slugs must exist
    if (destination?.parent?.slug && destination.slug && trip.slug) {
      const country = destination.parent;
      return `/${country.slug}/${destination.slug}/${trip.slug}`;
    }
  }

  // Fallback to new route structure if destination data is missing
  const countrySlug = "nepal";
  const destSlug = trip.region ? createSlug(trip.region) : "destinations";
  const tripSlug = trip.slug || createSlug(trip.title);

  return `/${countrySlug}/${destSlug}/${tripSlug}`;
}

/**
 * Generate a URL-safe slug from a title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

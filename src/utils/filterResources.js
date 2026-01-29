/**
 * Filter utilities for food resources.
 * Results are driven by location search: map and list stay empty until the user
 * searches by address or ZIP; then only pantries within the chosen radius are shown.
 */

import { hasHoursToday } from "../data/foodResourcesService";
import { haversineMiles } from "./locationUtils";

/**
 * Filter resources by search center + radius (miles), then by other criteria.
 * When searchCenter is null, returns [] so the map and list start empty.
 * Only resources with coordinates are included when filtering by location.
 *
 * @param {Array} resources - All food resource objects
 * @param {Object} filters - { searchCenter: { lat, lng } | null, radiusMiles, openToday, hasDelivery, searchText, type }
 * @returns {Array} Filtered array, sorted by distance (nearest first); each item may have .distanceMiles
 */
export function filterResources(resources, filters) {
  const center = filters.searchCenter;
  const radiusMiles = Number(filters.radiusMiles) || 1;

  // No search location → show nothing (map and list stay empty)
  if (
    !center ||
    typeof center.lat !== "number" ||
    typeof center.lng !== "number"
  ) {
    return [];
  }

  // Only consider resources that have coordinates
  let filtered = resources.filter(
    (r) =>
      r.address &&
      Array.isArray(r.address.coordinates) &&
      r.address.coordinates.length === 2,
  );

  // Filter by radius and attach distance
  const centerPoint = { lat: center.lat, lng: center.lng };
  filtered = filtered
    .map((resource) => {
      const [lng, lat] = resource.address.coordinates;
      const distanceMiles = haversineMiles(centerPoint, { lat, lng });
      return { ...resource, distanceMiles };
    })
    .filter((r) => r.distanceMiles <= radiusMiles);

  // Secondary filters
  filtered = filtered.filter((resource) => {
    if (
      filters.type &&
      filters.type !== "all" &&
      resource.type !== filters.type
    ) {
      return false;
    }

    if (filters.searchText && filters.searchText.trim() !== "") {
      const term = filters.searchText.toLowerCase();
      const nameText = (resource.name || "").toLowerCase();
      const addressText = [
        resource.address?.street,
        resource.address?.city,
        resource.address?.zip,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!nameText.includes(term) && !addressText.includes(term)) {
        return false;
      }
    }

    if (filters.openToday && !hasHoursToday(resource)) {
      return false;
    }

    if (
      filters.hasDelivery !== null &&
      filters.hasDelivery !== undefined &&
      resource.hasDelivery !== filters.hasDelivery
    ) {
      return false;
    }

    return true;
  });

  // Sort by distance (nearest first)
  filtered.sort((a, b) => (a.distanceMiles || 0) - (b.distanceMiles || 0));

  return filtered;
}

/**
 * Default filter state. Map and list are empty until user runs a location search.
 */
export function getDefaultFilters() {
  return {
    type: "all",
    openToday: false,
    hasDelivery: null,
    searchText: "",
    searchLocation: "",
    searchCenter: null,
    radiusMiles: 1,
  };
}

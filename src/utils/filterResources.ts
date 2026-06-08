/**
 * Filter utilities for food resources.
 * Results are driven by location search: map and list stay empty until the user
 * searches by address or ZIP; then only pantries within the chosen radius are shown.
 */

import { hasHoursToday } from "../data/foodResourcesService";
import { haversineMiles } from "./locationUtils";

// --- Type definitions ---

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress?: string;
  coordinates: [number, number] | null; // [lng, lat]
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface WeeklyHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

export interface FoodResource {
  id: string;
  name: string;
  type: string;
  description: string;
  address: Address;
  hours: WeeklyHours | null;
  requiresReferral: boolean | null;
  hasDelivery: boolean;
  distanceMiles?: number;
  contact: {
    phone: string | null;
    email: string | null;
    website: string | null;
    contactName: string | null;
  };
}

export interface FilterState {
  type: string;
  openToday: boolean;
  hasDelivery: boolean | null;
  searchText: string;
  searchLocation: string;
  searchCenter: Coordinates | null;
  radiusMiles: number;
}

// --- Filter logic ---

export function filterResources(
  resources: FoodResource[],
  filters: FilterState
): FoodResource[] {
  const center = filters.searchCenter;
  const radiusMiles = Number(filters.radiusMiles) || 1;

  if (
    !center ||
    typeof center.lat !== "number" ||
    typeof center.lng !== "number"
  ) {
    return [];
  }

  let filtered = resources.filter(
    (r) =>
      r.address &&
      Array.isArray(r.address.coordinates) &&
      r.address.coordinates.length === 2
  );

  filtered = filtered
    .map((resource) => {
      const [lng, lat] = resource.address.coordinates as [number, number];
      const distanceMiles = haversineMiles(center, { lat, lng });
      return { ...resource, distanceMiles };
    })
    .filter((r) => r.distanceMiles <= radiusMiles);

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

  filtered.sort((a, b) => (a.distanceMiles || 0) - (b.distanceMiles || 0));

  return filtered;
}

export function getDefaultFilters(): FilterState {
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

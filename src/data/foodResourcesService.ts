import type { FoodResource } from "../utils/filterResources";

// --- Day lookup ---

const DAY_ABBR_MAP: Record<string, keyof NonNullable<FoodResource["hours"]>> = {
  mon: "monday",
  tue: "tuesday",
  wed: "wednesday",
  thu: "thursday",
  fri: "friday",
  sat: "saturday",
  sun: "sunday",
};

function getCurrentDayName(): keyof NonNullable<FoodResource["hours"]> | undefined {
  const abbr = new Date()
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();
  return DAY_ABBR_MAP[abbr];
}

// --- Runtime display helpers ---
// These operate on already-normalized resources fetched from the API.

export function hasHoursToday(resource: FoodResource): boolean {
  if (!resource?.hours) return false;
  const dayName = getCurrentDayName();
  if (!dayName) return false;
  const dayHours = resource.hours[dayName];
  return !!(dayHours?.isOpen);
}

export function getHoursToday(resource: FoodResource): string | null {
  if (!resource?.hours) return null;
  const dayName = getCurrentDayName();
  if (!dayName) return null;
  const dayHours = resource.hours[dayName];
  if (!dayHours?.isOpen) return null;
  return `${dayHours.open} – ${dayHours.close}`;
}

export function sortResources(
  resources: FoodResource[],
  options: { sortBy?: "name" | "distance" } = {}
): FoodResource[] {
  const { sortBy = "name" } = options;
  const copy = [...resources];

  if (sortBy === "distance") {
    copy.sort((a, b) => {
      // Resources without a computed distance sort to the end
      const aDist = a.distanceMiles ?? Infinity;
      const bDist = b.distanceMiles ?? Infinity;
      return aDist - bDist;
    });
  } else {
    copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  return copy;
}
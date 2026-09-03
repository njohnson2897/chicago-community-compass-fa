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

export function isOpenNow(resource: FoodResource): boolean {
  if (!resource?.hours) return false;

  const dayName = getCurrentDayName();
  if (!dayName) return false;

  const dayHours = resource.hours[dayName];
  if (!dayHours?.isOpen) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = dayHours.open.split(":").map(Number);
  const [closeHour, closeMin] = dayHours.close.split(":").map(Number);

  return (
    currentMinutes >= openHour * 60 + openMin &&
    currentMinutes <= closeHour * 60 + closeMin
  );
}

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
  options: { sortBy?: string } = {}
): FoodResource[] {
  const { sortBy = "name" } = options;
  const copy = [...resources];

  if (sortBy === "name") {
    copy.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  return copy;
}
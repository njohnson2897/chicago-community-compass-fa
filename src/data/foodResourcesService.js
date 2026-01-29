import pantryData from "./pantryData.json";

/**
 * Normalize a raw pantry JSON record into the internal resource shape
 * used by the map and list UI.
 *
 * We intentionally:
 * - Do NOT invent fields that don't exist in the JSON
 * - Mark missing text fields as "Unknown" only for display helpers
 * - Use latitude/longitude from the JSON when present (e.g. after running scripts/geocode-pantry-addresses.mjs)
 */

const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_NAME_MAP = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
};

function createEmptyWeek() {
  return DAY_KEYS.reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {});
}

function to24HourTime(label) {
  // Expects strings like "2:00 PM" or "11:30 am"
  const match = label.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
  if (!match) return null;
  const [, hourStr, minuteStr, ampm] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const upper = ampm.toUpperCase();

  if (upper === "PM" && hour !== 12) {
    hour += 12;
  } else if (upper === "AM" && hour === 12) {
    hour = 0;
  }

  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Parse a single "regular_hours" line into a specific weekday window.
 * Examples of supported patterns:
 * - "Monday 2:00 PM - 4:00 PM"
 * - "Saturday 1:00 PM - 3:00 PM (2nd, 4th of Month)"
 * - "Saturday: 9:30 AM - 11:30 AM"
 *
 * Returns: { dayKey, open, close } | null
 */
function parseHoursLine(line) {
  if (!line || typeof line !== "string") return null;

  const trimmed = line.trim();

  const regex =
    /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\s*:?\s+(\d{1,2}:\d{2}\s*[AP]M)\s*-\s*(\d{1,2}:\d{2}\s*[AP]M)/i;

  const match = trimmed.match(regex);
  if (!match) return null;

  const [, dayRaw, openLabel, closeLabel] = match;
  const dayKey = DAY_NAME_MAP[dayRaw.toLowerCase()];
  const open = to24HourTime(openLabel);
  const close = to24HourTime(closeLabel);

  if (!dayKey || !open || !close) return null;

  return {
    dayKey,
    open,
    close,
  };
}

function buildWeeklyHours(regularHours) {
  if (!regularHours) return null;

  const lines = Array.isArray(regularHours) ? regularHours : [regularHours];
  const week = createEmptyWeek();
  let hasAny = false;

  lines.forEach((line) => {
    const parsed = parseHoursLine(line);
    if (!parsed) return;

    const { dayKey, open, close } = parsed;
    week[dayKey] = {
      open,
      close,
      isOpen: true,
    };
    hasAny = true;
  });

  return hasAny ? week : null;
}

function parseAddress(address) {
  if (!address || typeof address !== "string") {
    return {
      street: "",
      city: "",
      state: "",
      zip: "",
      fullAddress: "",
      coordinates: null,
    };
  }

  const fullAddress = address.trim();

  // Attempt to parse "Street, City, ST ZIP" and common variants
  const regex = /^(.*?),(?:\s*)([A-Za-z\s]+?),(?:\s*)(IL)\s+(\d{5})$/i;
  const altRegex =
    /^(.*?)(?:\s+)(Chicago|Skokie|Evanston|Maywood|Melrose Park|Cicero|Berwyn|Oak Park|River Forest|Bellwood|Harvey|Dolton|Calumet City|Blue Island|Alsip|Summit|Elmwood Park|Burbank|Crestwood|Evergreen Park|Oak Lawn|Bridgeview|Bedford Park|Niles|Lincolnwood|Des Plaines|Park Ridge|Morton Grove|Rosemont|Forest Park|Lansing|Country Club Hills|Markham|Homewood|Hillside|Hines|La Grange|La Grange Park|Lyons|North Riverside|Riverside|Westchester|Broadview|Stone Park|Stickney|Robbins|Posen|Phoenix|River Grove|Glenview|Wheeling|Palatine|Arlington Heights|Rolling Meadows|Schaumburg|Skokie)\s*,?\s*(IL)\s+(\d{5})$/i;

  let street = "";
  let city = "";
  let state = "";
  let zip = "";

  let match = fullAddress.match(regex);
  if (match) {
    [, street, city, state, zip] = match;
  } else {
    match = fullAddress.match(altRegex);
    if (match) {
      [, street, city, state, zip] = match;
    } else {
      // Fallback: keep everything as street, and leave city/state/zip blank
      street = fullAddress;
    }
  }

  return {
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    zip: zip.trim(),
    fullAddress,
    coordinates: null, // Source JSON has no coordinates; we keep this null on purpose
  };
}

function pickPrimaryProgram(programs = []) {
  if (!Array.isArray(programs)) return null;
  if (programs.length === 0) return null;

  const pantryProgram = programs.find(
    (p) =>
      typeof p.category === "string" &&
      p.category.toLowerCase().includes("pantry"),
  );

  return pantryProgram || programs[0];
}

function deriveHasDelivery(programs = []) {
  if (!Array.isArray(programs)) return false;

  return programs.some((program) => {
    const text = `${program.category || ""}`.toLowerCase();
    return text.includes("delivery");
  });
}

function deriveRequiresReferral(programs = []) {
  if (!Array.isArray(programs)) return null;

  const hasReferralLanguage = programs.some((program) => {
    const text = [program.category, program.notes, program.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return text.includes("referral");
  });

  if (!hasReferralLanguage) return null;
  return true;
}

function buildDescription(organizationName, programs = []) {
  if (!Array.isArray(programs) || programs.length === 0) {
    return "";
  }

  const uniqueCategories = Array.from(
    new Set(programs.map((p) => p.category).filter(Boolean)),
  );

  const categoriesText = uniqueCategories.join(" • ");
  if (!categoriesText) return "";

  return `${organizationName} offers: ${categoriesText}.`;
}

function normalizeResource(raw, index) {
  const name = raw.organization_name || "Unknown";
  const address = parseAddress(raw.address);

  // Use geocoded coordinates if present (from geocode-pantry-addresses script)
  if (
    typeof raw.latitude === "number" &&
    typeof raw.longitude === "number" &&
    Number.isFinite(raw.latitude) &&
    Number.isFinite(raw.longitude)
  ) {
    address.coordinates = [raw.longitude, raw.latitude];
  }

  const programs = Array.isArray(raw.programs) ? raw.programs : [];
  const primaryProgram = pickPrimaryProgram(programs);

  const regularHours = primaryProgram?.regular_hours;
  const hours = buildWeeklyHours(regularHours);

  const hasDelivery = deriveHasDelivery(programs);
  const requiresReferral = deriveRequiresReferral(programs);

  const idSafe = `org-${index}-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

  return {
    id: idSafe,
    name,
    type: "food_pantry",
    description: buildDescription(name, programs),
    address,
    hours,
    requiresReferral,
    hasDelivery,
    deliveryDetails: null,
    eligibility: null,
    contact: {
      phone: raw.phone || primaryProgram?.phone || null,
      email: primaryProgram?.email || null,
      website: raw.website || null,
      contactName: raw.contact_name || primaryProgram?.contact_name || null,
    },
    notes: null,
    sourceMetadata: {
      // The JSON does not provide per-organization network/source
      // (e.g., "GCFD Partner"), so we intentionally leave this undefined.
      networkStatus: undefined,
    },
  };
}

const rawFoodPantries = Array.isArray(pantryData.food_pantries)
  ? pantryData.food_pantries
  : [];

const allResources = rawFoodPantries.map(normalizeResource);

export function getAllResources() {
  return allResources;
}

/**
 * Get a single resource by id. Returns null if not found.
 */
export function getResourceById(id) {
  if (!id) return null;
  return allResources.find((r) => r.id === id) ?? null;
}

/**
 * Utility: is a resource open "now" based on its normalized weekly hours.
 * This mirrors the original mock implementation but is decoupled from mock data.
 */
export function isOpenNow(resource) {
  if (!resource || !resource.hours) return false;

  const now = new Date();
  const currentDayAbbr = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  const dayMap = {
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
    sun: "sunday",
  };

  const dayName = dayMap[currentDayAbbr];
  const dayHours = resource.hours[dayName];

  if (!dayHours || !dayHours.isOpen) {
    return false;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openHour, openMin] = dayHours.open.split(":").map(Number);
  const [closeHour, closeMin] = dayHours.close.split(":").map(Number);
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

/**
 * Returns true if the resource has hours for the current day (open today at all).
 * Use for "Open today" filter; does not check current time.
 */
export function hasHoursToday(resource) {
  if (!resource || !resource.hours) return false;

  const now = new Date();
  const currentDayAbbr = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  const dayMap = {
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
    sun: "sunday",
  };

  const dayName = dayMap[currentDayAbbr];
  const dayHours = resource.hours[dayName];

  return !!(dayHours && dayHours.isOpen);
}

/**
 * Optional helper: compute a lightweight "hours today" label.
 * Returns null if hours are not known.
 */
export function getHoursToday(resource) {
  if (!resource || !resource.hours) return null;

  const now = new Date();
  const currentDayAbbr = now
    .toLocaleDateString("en-US", { weekday: "short" })
    .toLowerCase();

  const dayMap = {
    mon: "monday",
    tue: "tuesday",
    wed: "wednesday",
    thu: "thursday",
    fri: "friday",
    sat: "saturday",
    sun: "sunday",
  };

  const dayName = dayMap[currentDayAbbr];
  const dayHours = resource.hours[dayName];

  if (!dayHours || !dayHours.isOpen) {
    return null;
  }

  return `${dayHours.open} – ${dayHours.close}`;
}

/**
 * Simple sorting helper so the "data access layer" can hand back
 * consistently ordered arrays.
 *
 * Currently supports:
 * - sortBy: 'name' (default)
 */
export function sortResources(resources, options = {}) {
  const { sortBy = "name" } = options;

  const copy = [...resources];

  if (sortBy === "name") {
    copy.sort((a, b) => {
      return (a.name || "").localeCompare(b.name || "");
    });
  }

  return copy;
}

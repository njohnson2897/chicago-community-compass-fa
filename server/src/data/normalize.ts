// Types and normalization logic for pantry data.
// --- Normalized output types ---

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

// --- Raw JSON types ---

interface RawProgram {
  category?: string;
  contact_name?: string;
  phone?: string;
  email?: string;
  regular_hours?: string[];
  notes?: string;
  description?: string;
}

export interface RawPantryRecord {
  organization_name?: string;
  address?: string;
  phone?: string;
  website?: string;
  contact_name?: string;
  latitude?: number;
  longitude?: number;
  programs?: RawProgram[];
}

const FOOD_PANTRY = "food_pantry";

// --- Constants ---

const DAY_KEYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DayKey = typeof DAY_KEYS[number];

const DAY_NAME_MAP: Record<string, DayKey> = {
  monday: "monday",
  tuesday: "tuesday",
  wednesday: "wednesday",
  thursday: "thursday",
  friday: "friday",
  saturday: "saturday",
  sunday: "sunday",
};

// --- Helper functions ---

function createEmptyWeek(): WeeklyHours {
  return DAY_KEYS.reduce((acc, key) => {
    acc[key] = null;
    return acc;
  }, {} as WeeklyHours);
}

function to24HourTime(label: string): string | null {
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

function parseHoursLine(
  line: string
): { dayKey: DayKey; open: string; close: string } | null {
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

  return { dayKey, open, close };
}

function buildWeeklyHours(
  regularHours: string | string[] | undefined
): WeeklyHours | null {
  if (!regularHours) return null;

  const lines = Array.isArray(regularHours) ? regularHours : [regularHours];
  const week = createEmptyWeek();
  let hasAny = false;

  lines.forEach((line) => {
    const parsed = parseHoursLine(line);
    if (!parsed) return;

    const { dayKey, open, close } = parsed;
    week[dayKey] = { open, close, isOpen: true };
    hasAny = true;
  });

  return hasAny ? week : null;
}

function parseAddress(address: unknown): Address {
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
  const regex = /^(.*?),(?:\s*)([A-Za-z\s]+?),(?:\s*)(IL)\s+(\d{5})$/i;

  let street = "";
  let city = "";
  let state = "";
  let zip = "";

  const match = fullAddress.match(regex);
  if (match) {
    [, street, city, state, zip] = match;
  } else {
    street = fullAddress;
  }

  return {
    street: street.trim(),
    city: city.trim(),
    state: state.trim(),
    zip: zip.trim(),
    fullAddress,
    coordinates: null,
  };
}

function pickPrimaryProgram(programs: RawProgram[]): RawProgram | null {
  if (!Array.isArray(programs) || programs.length === 0) return null;

  const pantryProgram = programs.find(
    (p) =>
      typeof p.category === "string" &&
      p.category.toLowerCase().includes("pantry")
  );

  return pantryProgram ?? programs[0];
}

function deriveHasDelivery(programs: RawProgram[]): boolean {
  if (!Array.isArray(programs)) return false;
  return programs.some((program) =>
    `${program.category || ""}`.toLowerCase().includes("delivery")
  );
}

function deriveRequiresReferral(programs: RawProgram[]): boolean | null {
  if (!Array.isArray(programs)) return null;

  const hasReferralLanguage = programs.some((program) => {
    const text = [program.category, program.notes, program.description]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return text.includes("referral");
  });

  return hasReferralLanguage ? true : null;
}

function buildDescription(
  organizationName: string,
  programs: RawProgram[]
): string {
  if (!Array.isArray(programs) || programs.length === 0) return "";

  const uniqueCategories = Array.from(
    new Set(programs.map((p) => p.category).filter(Boolean))
  );

  const categoriesText = uniqueCategories.join(" • ");
  if (!categoriesText) return "";

  return `${organizationName} offers: ${categoriesText}.`;
}

export function normalizeResource(
  raw: RawPantryRecord,
  index: number
): FoodResource {
  const name = raw.organization_name || "Unknown";
  const address = parseAddress(raw.address);

  if (
    typeof raw.latitude === "number" &&
    typeof raw.longitude === "number" &&
    Number.isFinite(raw.latitude) &&
    Number.isFinite(raw.longitude)
  ) {
    address.coordinates = [raw.longitude, raw.latitude];
  }

  const programs: RawProgram[] = Array.isArray(raw.programs) ? raw.programs : [];
  const primaryProgram = pickPrimaryProgram(programs);
  const hours = buildWeeklyHours(primaryProgram?.regular_hours);
  const hasDelivery = deriveHasDelivery(programs);
  const requiresReferral = deriveRequiresReferral(programs);

  const idSafe = `org-${index}-${name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;

  return {
    id: idSafe,
    name,
    type: FOOD_PANTRY,
    description: buildDescription(name, programs),
    address,
    hours,
    requiresReferral,
    hasDelivery,
    contact: {
      phone: raw.phone ?? primaryProgram?.phone ?? null,
      email: primaryProgram?.email ?? null,
      website: raw.website ?? null,
      contactName: raw.contact_name ?? primaryProgram?.contact_name ?? null,
    },
  };
}
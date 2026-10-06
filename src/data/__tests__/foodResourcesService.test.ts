/// <reference types="vitest/globals" />
import { hasHoursToday, getHoursToday, formatTime } from "../foodResourcesService";
import type { FoodResource, WeeklyHours } from "../../utils/filterResources";
import { RESOURCE_TYPES } from "../../utils/resourceTypes";


// Helper fake resource creation
function makeResourceWithHours(
  overrides: Partial<FoodResource> = {}
): FoodResource {
  return {
    id: "org-test",
    name: "Test Pantry",
    type: RESOURCE_TYPES.FOOD_PANTRY,
    description: "",
    address: {
      street: "123 Main St",
      city: "Chicago",
      state: "IL",
      zip: "60601",
      fullAddress: "123 Main St, Chicago, IL 60601",
      coordinates: [-87.6298, 41.8781],
    },
    hours: {
      monday: { open: "09:00", close: "17:00", isOpen: true },
      tuesday: { open: "09:00", close: "17:00", isOpen: true },
      wednesday: { open: "09:00", close: "17:00", isOpen: true },
      thursday: { open: "09:00", close: "17:00", isOpen: true },
      friday: { open: "09:00", close: "17:00", isOpen: true },
      saturday: { open: "10:00", close: "14:00", isOpen: true },
      sunday: null,
    },
    requiresReferral: null,
    hasDelivery: false,
    contact: {
      phone: null,
      email: null,
      website: null,
      contactName: null,
    },
    ...overrides,
  };
}

describe("hasHoursToday", () => {
  it("returns false when resource has no hours", () => {
    const resource = makeResourceWithHours({ hours: null });
    expect(hasHoursToday(resource)).toBe(false);
  });

  it("returns true when resource has hours for today", () => {
    // This resource is open every day except Sunday
    // Test will pass any day except Sunday
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as keyof WeeklyHours; 
    
    const resource = makeResourceWithHours();
    const todayHours = resource.hours?.[today];
    
    // Only assert if today isn't Sunday (where hours are null)
    if (todayHours?.isOpen) {
      expect(hasHoursToday(resource)).toBe(true);
    } else {
      expect(hasHoursToday(resource)).toBe(false);
    }
  });

  it("returns false when today's hours are null", () => {
    // Build a resource with ALL days set to null
    const resource = makeResourceWithHours({
      hours: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
    expect(hasHoursToday(resource)).toBe(false);
  });
});

describe("getHoursToday", () => {
  it("returns null when resource has no hours", () => {
    const resource = makeResourceWithHours({ hours: null });
    expect(getHoursToday(resource)).toBeNull();
  });

  it("returns null when today's hours are null", () => {
    const resource = makeResourceWithHours({
      hours: {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      },
    });
    expect(getHoursToday(resource)).toBeNull();
  });

  it("returns a formatted hours string when today's hours exist", () => {
    // Open every day with the same hours, so this passes regardless of today
    const resource = makeResourceWithHours({
      hours: {
        monday: { open: "09:00", close: "17:00", isOpen: true },
        tuesday: { open: "09:00", close: "17:00", isOpen: true },
        wednesday: { open: "09:00", close: "17:00", isOpen: true },
        thursday: { open: "09:00", close: "17:00", isOpen: true },
        friday: { open: "09:00", close: "17:00", isOpen: true },
        saturday: { open: "09:00", close: "17:00", isOpen: true },
        sunday: { open: "09:00", close: "17:00", isOpen: true },
      },
    });
    expect(getHoursToday(resource)).toBe("9:00 AM – 5:00 PM");
  });

describe("formatTime", () => {
  it("formats morning times with AM", () => {
    expect(formatTime("09:00")).toBe("9:00 AM");
  });

  it("formats afternoon times with PM", () => {
    expect(formatTime("14:30")).toBe("2:30 PM");
  });

  it("formats noon as 12:00 PM", () => {
    expect(formatTime("12:00")).toBe("12:00 PM");
  });

  it("formats midnight as 12:00 AM", () => {
    expect(formatTime("00:00")).toBe("12:00 AM");
  });

  it("preserves minutes with leading zeros", () => {
    expect(formatTime("08:05")).toBe("8:05 AM");
  });

  it("returns the raw string when the input can't be parsed", () => {
    expect(formatTime("not-a-time")).toBe("not-a-time");
  });
});
});
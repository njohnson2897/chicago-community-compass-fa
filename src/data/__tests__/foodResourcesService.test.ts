/// <reference types="vitest/globals" />
import { hasHoursToday, isOpenNow } from "../foodResourcesService";
import type { FoodResource } from "../../utils/filterResources";

// Helper fake resource creation
function makeResourceWithHours(
  overrides: Partial<FoodResource> = {}
): FoodResource {
  return {
    id: "org-test",
    name: "Test Pantry",
    type: "food_pantry",
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
      .toLowerCase() as keyof typeof resource.hours;
    
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
import { filterResources, getDefaultFilters } from "../filterResources";

// Create a minimal fake resource with coordinates, used across tests.

function makeFakeResource(overrides = {}) {
    return {
        id: "org-1-test",
        name: "Test Pantry",
        type: "food_pantry",
        address: {
          street: "123 Main St",
          city: "Chicago",
          state: "IL",
          zip: "60601",
          coordinates: [-87.6298, 41.8781], // downtown Chicago [lng, lat]
        },
        hours: null,
        hasDelivery: false,
        ...overrides,
      };
    }

// Test suite

describe("filterResources", () => {

    it("returns empty array when searchCenter is null", () => {
      const resources = [makeFakeResource()];
      const filters = {
        ...getDefaultFilters(),
        searchCenter: null,
      };
  
      const result = filterResources(resources, filters);
  
      expect(result).toEqual([]);
    });
  
    it("includes a resource within the radius", () => {
      const resources = [makeFakeResource()];
      const filters = {
        ...getDefaultFilters(),
        searchCenter: { lat: 41.8781, lng: -87.6298 }, // same point
        radiusMiles: 1,
      };
  
      const result = filterResources(resources, filters);
  
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("org-1-test");
    });
  
    it("excludes a resource outside the radius", () => {
      const resources = [
        makeFakeResource({
          id: "org-near",
          address: {
            street: "123 Main St",
            city: "Chicago",
            state: "IL",
            zip: "60601",
            coordinates: [-87.6298, 41.8781], // downtown Chicago
          },
        }),
        makeFakeResource({
          id: "org-far",
          address: {
            street: "456 Far St",
            city: "Evanston",
            state: "IL",
            zip: "60201",
            coordinates: [-87.6876, 42.0451], // Evanston, ~13 miles away
          },
        }),
      ];
  
      const filters = {
        ...getDefaultFilters(),
        searchCenter: { lat: 41.8781, lng: -87.6298 },
        radiusMiles: 1,
      };
  
      const result = filterResources(resources, filters);
  
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("org-near");
    });
  
  });
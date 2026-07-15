/// <reference types="vitest/globals" />

import { filterResources, getDefaultFilters, type FoodResource } from "../filterResources";
import { RESOURCE_TYPES } from "../resourceTypes";

// Create a minimal fake resource with coordinates, used across tests.

function makeFakeResource(overrides: Partial<FoodResource> = {}): FoodResource {
  return {
    id: "org-1-test",
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
    hours: null,
    hasDelivery: false,
    requiresReferral: null,
    contact: {
      phone: null,
      email: null,
      website: null,
      contactName: null,
    },
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

    it("sorts results by distance, nearest first", () => {
  const resources = [
    makeFakeResource({
      id: "org-far",
      address: {
        street: "456 Far St",
        city: "Chicago",
        state: "IL",
        zip: "60614",
        coordinates: [-87.6298, 41.9281],
      },
    }),
    makeFakeResource({
      id: "org-near",
      address: {
        street: "123 Close St",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        coordinates: [-87.6298, 41.8831],
      },
    }),
  ];

  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 10,
  };

  const result = filterResources(resources, filters);

  expect(result[0].id).toBe("org-near");
  expect(result[1].id).toBe("org-far");
});

it("excludes resources that don't match the type filter", () => {
  const resources = [
    makeFakeResource({ id: "org-pantry", type: RESOURCE_TYPES.FOOD_PANTRY }),
    makeFakeResource({ id: "org-fridge", type: "love_fridge" }),
  ];

  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 10,
    type: RESOURCE_TYPES.FOOD_PANTRY,
  };

  const result = filterResources(resources, filters);

  expect(result).toHaveLength(1);
  expect(result[0].id).toBe("org-pantry");
});

it("attaches distanceMiles to each result", () => {
  const resources = [makeFakeResource()];

  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 1,
  };

  const result = filterResources(resources, filters);

  expect(typeof result[0].distanceMiles).toBe("number");
  expect(result[0].distanceMiles).toBeGreaterThanOrEqual(0);
});

it("filters by searchText matching resource name", () => {
  const resources = [
    makeFakeResource({ id: "org-match", name: "Pilsen Food Pantry" }),
    makeFakeResource({ id: "org-no-match", name: "Northside Community Church" }),
  ];

  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 10,
    searchText: "pilsen",
  };

  const result = filterResources(resources, filters);

  expect(result).toHaveLength(1);
  expect(result[0].id).toBe("org-match");
});

it("excludes resources that have no coordinates", () => {
  const resources = [
    makeFakeResource({ id: "org-with-coords" }),
    makeFakeResource({
      id: "org-no-coords",
      address: {
        street: "123 Main St",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        coordinates: null,
      },
    }),
  ];

  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 10,
  };

  const result = filterResources(resources, filters);

  expect(result).toHaveLength(1);
  expect(result[0].id).toBe("org-with-coords");
});

it("returns empty array when resources array is empty", () => {
  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 1,
  };

  const result = filterResources([], filters);

  expect(result).toEqual([]);
});

it("treats radiusMiles of 0 as default radius of 1 mile", () => {
  const resources = [makeFakeResource()];
  const filters = {
    ...getDefaultFilters(),
    searchCenter: { lat: 41.8781, lng: -87.6298 },
    radiusMiles: 0,
  };

  const result = filterResources(resources, filters);

  // 0 radius defaults to 1 mile, resource at same coords should be included
  expect(result).toHaveLength(1);
});

});
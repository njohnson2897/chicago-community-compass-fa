// --- Resource type constants ---

export const RESOURCE_TYPES = {
  FOOD_PANTRY: "food_pantry",
  LOVE_FRIDGE: "love_fridge",
  COMMUNITY_FRIDGE: "community_fridge",
} as const;

export type ResourceType = typeof RESOURCE_TYPES[keyof typeof RESOURCE_TYPES];
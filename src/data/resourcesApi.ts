import type { FoodResource } from "../utils/filterResources";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ResourcesResponse {
  data: FoodResource[];
  total: number;
}

/**
 * Fetch all resources from the backend API.
 * Throws on network failure or non-OK response so callers can handle errors.
 */
export async function fetchResources(): Promise<FoodResource[]> {
  const res = await fetch(`${API_URL}/api/resources`);

  if (!res.ok) {
    throw new Error(`Failed to fetch resources: ${res.status}`);
  }

  const body: ResourcesResponse = await res.json();
  return body.data;
}
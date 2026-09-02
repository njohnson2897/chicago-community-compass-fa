import type { FoodResource } from "../utils/filterResources";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface ResourcesResponse {
  data: FoodResource[];
  total: number;
}

// Fetch all resources from the backend API.
export async function fetchResources(): Promise<FoodResource[]> {
  const res = await fetch(`${API_URL}/api/resources`);

  if (!res.ok) {
    throw new Error(`Failed to fetch resources: ${res.status}`);
  }

  const body: ResourcesResponse = await res.json();
  return body.data;
}

// Fetch a single resource by id from the backend API.
export async function fetchResourceById(id: string): Promise<FoodResource | null> {
  const res = await fetch(`${API_URL}/api/resources/${id}`);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch resource: ${res.status}`);
  }

  const body: { data: FoodResource } = await res.json();
  return body.data;
}
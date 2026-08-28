import { Router } from "express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { normalizeResource, type RawPantryRecord, type FoodResource } from "../data/normalize.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load, parse, and normalize pantry data once at startup
const dataPath = join(__dirname, "../../../src/data/pantryData.json");

let allResources: FoodResource[] = [];
try {
  const rawData: { food_pantries?: RawPantryRecord[] } = JSON.parse(
    readFileSync(dataPath, "utf-8")
  );
  const rawRecords = Array.isArray(rawData.food_pantries)
    ? rawData.food_pantries
    : [];
  allResources = rawRecords.map(normalizeResource);
} catch (err) {
  console.error(`Failed to load pantry data from ${dataPath}:`, err);
  allResources = [];
}

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit as string, 10);
  const type = req.query.type as string | undefined;
  const zip = req.query.zip as string | undefined;

  let results = allResources;

  if (type) {
    results = results.filter((r) => r.type === type);
  }

  if (zip) {
    results = results.filter((r) => r.address.zip === zip);
  }

  if (!isNaN(limit) && limit > 0) {
    results = results.slice(0, limit);
  }

  res.json({
    data: results,
    total: results.length,
  });
});

export default router;
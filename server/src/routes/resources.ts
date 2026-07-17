import { Router } from "express";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load and parse pantry data
const dataPath = join(__dirname, "../../../src/data/pantryData.json");
const rawData = JSON.parse(readFileSync(dataPath, "utf-8"));

router.get("/", (_req, res) => {
  res.json({
    data: rawData.food_pantries,
    total: rawData.food_pantries.length,
  });
});

export default router;
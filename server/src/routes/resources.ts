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

router.get("/", (req, res) => {
  const limit = parseInt(req.query.limit as string, 10);
  const type = req.query.type as string | undefined;

  let results = rawData.food_pantries;

  if (type) {
    results = results.filter(
      (r: { type?: string }) => r.type === type
    );
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
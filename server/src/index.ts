import express from "express";
import cors from "cors";
import resourcesRouter from "./routes/resources.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/resources", resourcesRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "development";
  console.log(`Server running on port ${PORT} [${env}]`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
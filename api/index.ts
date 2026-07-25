import "dotenv/config";
import express from "express";
import evaluationRoutes from "../server/routes/evaluationRoutes";

const app = express();

app.use(express.json());

// Handle /api/evaluate, /evaluate, and / so Vercel rewrites match regardless of path stripping
app.use(["/api/evaluate", "/evaluate", "/"], evaluationRoutes);

export default app;

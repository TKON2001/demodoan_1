import "dotenv/config";
import express from "express";
import evaluationRoutes from "../server/routes/evaluationRoutes";

const app = express();

app.use(express.json());

// API routes
app.use("/api/evaluate", evaluationRoutes);

export default app;

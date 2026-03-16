import { Request, Response } from "express";
import { runBenchmark } from "../services/benchmarkEngine";

export async function evaluatePrompt(req: Request, res: Response) {
  try {
    const { prompt, models, reference, apiKeys } = req.body;
    const start = performance.now();
    const results = await runBenchmark(prompt, models, reference, apiKeys);
    const end = performance.now();
    
    res.json({ results, totalTime: (end - start) / 1000 });
  } catch (error: any) {
    console.error("Evaluation error:", error);
    res.status(500).json({ error: error.message || "Lỗi khi chạy đánh giá" });
  }
}

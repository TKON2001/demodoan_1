import { runModel } from "./llmRunner";
import { measureLatency, estimateTokens, calculateCost } from "./metricsService";
import { evaluateWithLLMJudge } from "./scoringService";

export async function runBenchmark(prompt: string, models: string[], reference?: string, apiKeys?: any) {
  const tasks = models.map(async (model) => {
    const start = performance.now();
    try {
      const response = await runModel(prompt, model, apiKeys);
      const end = performance.now();
      
      const latency = measureLatency(start, end);
      const tokens = estimateTokens(response);
      const cost = calculateCost(model, tokens);
      
      // Sử dụng LLM-as-a-Judge để chấm điểm
      const judgeResult = await evaluateWithLLMJudge(prompt, response, reference, apiKeys);

      return {
        model,
        response,
        latency,
        tokens,
        cost,
        accuracy: judgeResult.score,
        reasoning: judgeResult.reasoning,
        status: "success"
      };
    } catch (error: any) {
      const end = performance.now();
      return {
        model,
        response: `Lỗi: ${error.message}`,
        latency: measureLatency(start, end),
        tokens: 0,
        cost: 0,
        accuracy: 0,
        reasoning: "Không thể đánh giá do lỗi.",
        status: "error"
      };
    }
  });

  return await Promise.all(tasks);
}

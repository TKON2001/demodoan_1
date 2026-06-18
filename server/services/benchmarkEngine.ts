import { runModel } from "./llmRunner";
import { measureLatency, estimateTokens, calculateCost } from "./metricsService";
import { evaluateWithLLMJudge } from "./scoringService";
import { calculateCompositeScore } from "./compositeScoreService";

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

      const compositeScores = calculateCompositeScore(judgeResult.score, latency, cost, tokens);

      return {
        model,
        response,
        latency,
        tokens,
        cost,
        accuracy: judgeResult.score,
        reasoning: judgeResult.reasoning,
        status: "success",
        ...compositeScores
      };
    } catch (error: any) {
      const end = performance.now();
      const latency = measureLatency(start, end);
      return {
        model,
        response: `Lỗi: ${error.message}`,
        latency,
        tokens: 0,
        cost: 0,
        accuracy: 0,
        reasoning: "Không thể đánh giá do lỗi.",
        status: "error",
        qualityScore: 0,
        latencyScore: 0,
        costScore: 0,
        tokenScore: 0,
        totalScore: 0
      };
    }
  });

  const results = await Promise.all(tasks);

  // Xếp hạng các mô hình dựa trên totalScore giảm dần
  const rankedResults = results
    .map(result => ({ ...result }))
    .sort((a, b) => b.totalScore - a.totalScore)
    .map((result, index) => ({
      ...result,
      rank: index + 1
    }));

  // But we want to return results in their original or ranked order?
  // Let's return them in ranked order for better display.
  return rankedResults;
}

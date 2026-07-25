import { runModel } from "./llmRunner";
import { measureLatency, estimateTokens, calculateCost } from "./metricsService";
import { evaluateWithLLMJudge } from "./scoringService";
import { calculateCompositeScore } from "./compositeScoreService";
import { retrieveContext } from "./ragService";

export async function runBenchmark(prompt: string, models: string[], reference?: string, apiKeys?: any) {
  const mockMode = apiKeys?.useMockMode === true;
  const geminiKey = apiKeys?.gemini || process.env.GEMINI_API_KEY;

  // Retrieve RAG context once for the whole benchmark if live mode and key exists
  let ragContext = "";
  if (!mockMode && geminiKey) {
    try {
      ragContext = await retrieveContext(prompt, geminiKey);
    } catch (e) {
      console.warn("RAG retrieval failed at benchmark level:", e);
    }
  }

  const tasks = models.map(async (model) => {
    const start = Date.now();
    try {
      const response = await runModel(prompt, model, apiKeys);
      const end = Date.now();
      
      const latency = measureLatency(start, end);
      const tokens = estimateTokens(response);
      const cost = calculateCost(model, tokens);
      
      let judgeResult = { score: 0.7, reasoning: "Đánh giá sơ bộ." };

      // Chỉ gọi LLM Judge nếu model trả lời thành công
      if (!response.startsWith("Lỗi:")) {
        judgeResult = await evaluateWithLLMJudge(prompt, response, reference, apiKeys, ragContext);
      } else {
        judgeResult = { score: 0, reasoning: "Mô hình gặp lỗi, không thể đánh giá chất lượng." };
      }

      const compositeScores = calculateCompositeScore(judgeResult.score, latency, cost, tokens);

      return {
        model,
        response,
        latency,
        tokens,
        cost,
        accuracy: judgeResult.score,
        reasoning: judgeResult.reasoning,
        status: response.startsWith("Lỗi:") ? "error" : "success",
        ...compositeScores
      };
    } catch (error: any) {
      const end = Date.now();
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

  return rankedResults;
}

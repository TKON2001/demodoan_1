export function calculateLatencyScore(latency: number): number {
  if (latency <= 2) return 10;
  if (latency <= 4) return 8;
  if (latency <= 6) return 6;
  if (latency <= 8) return 2;
  if (latency <= 10) return 1;
  return 0;
}

export function calculateTokenScore(tokens: number): number {
  if (tokens <= 50) return 10;
  if (tokens <= 100) return 8;
  if (tokens <= 150) return 6;
  if (tokens <= 200) return 4;
  return 2;
}

export function calculateCostScore(cost: number): number {
  if (cost <= 0.00005) return 10;
  if (cost <= 0.00010) return 8;
  if (cost <= 0.00030) return 6;
  if (cost <= 0.00080) return 4;
  return 2;
}

export function calculateCompositeScore(quality: number, latency: number, cost: number, tokens: number) {
  const qualityScore = quality <= 1.0 ? quality * 10 : quality;
  const latencyScore = calculateLatencyScore(latency);
  const costScore = calculateCostScore(cost);
  const tokenScore = calculateTokenScore(tokens);

  const totalScore = (0.5 * qualityScore) + (0.2 * latencyScore) + (0.2 * costScore) + (0.1 * tokenScore);

  return {
    qualityScore,
    latencyScore,
    costScore,
    tokenScore,
    totalScore: parseFloat(totalScore.toFixed(2))
  };
}

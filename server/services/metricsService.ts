export function measureLatency(start: number, end: number): number {
  return (end - start) / 1000;
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function calculateCost(model: string, tokens: number): number {
  // Giả định chi phí trên 1K token (USD)
  const rates: Record<string, number> = {
    "GPT": 0.005,
    "Gemini": 0.001,
    "DeepSeek": 0.0005,
    "Llama": 0.0002,
  };
  
  const rate = rates[model] || 0.001;
  return (tokens / 1000) * rate;
}

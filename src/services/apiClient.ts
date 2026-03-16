export async function evaluatePrompt(prompt: string, models: string[], reference?: string, apiKeys?: any) {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, models, reference, apiKeys })
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Lỗi kết nối đến server");
  }
  return res.json();
}

export async function evaluatePrompt(prompt: string, models: string[], reference?: string, apiKeys?: any) {
  const res = await fetch("/api/evaluate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, models, reference, apiKeys })
  });
  if (!res.ok) {
    const text = await res.text();
    let errorData;
    try {
      errorData = JSON.parse(text);
    } catch (e: any) {
      if (text.includes("A server error occurred") || text.includes("FUNCTION_INVOCATION_TIMEOUT") || text.includes("504") || res.status === 504) {
        throw new Error("Lỗi Timeout: Server mất quá nhiều thời gian để xử lý. Vui lòng chọn ít mô hình hơn (1-2 mô hình) để tránh quá tải.");
      }
      throw new Error(`Lỗi server (${res.status}): ${text.substring(0, 100)}`);
    }
    throw new Error(errorData.error || "Lỗi kết nối đến server");
  }
  return res.json();
}

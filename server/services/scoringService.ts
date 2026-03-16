import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function evaluateWithLLMJudge(prompt: string, response: string, reference?: string, apiKeys?: any): Promise<{score: number, reasoning: string}> {
  try {
    let systemInstruction = "Bạn là một giám khảo AI khách quan (LLM-as-a-Judge). Nhiệm vụ của bạn là đánh giá chất lượng câu trả lời của một AI khác dựa trên yêu cầu của người dùng. Trả về kết quả dưới dạng JSON với 2 trường: 'score' (số từ 0.0 đến 1.0) và 'reasoning' (giải thích ngắn gọn bằng tiếng Việt).";
    let contents = `Yêu cầu của người dùng: "${prompt}"\n\nCâu trả lời cần đánh giá: "${response}"`;
    
    if (reference) {
      contents += `\n\nĐáp án chuẩn (Reference): "${reference}"\nHãy so sánh câu trả lời với đáp án chuẩn.`;
    } else {
      contents += `\n\nHãy đánh giá mức độ chính xác, hữu ích và an toàn của câu trả lời.`;
    }

    let jsonStr = "{}";

    // Nếu có Anthropic API Key, ưu tiên dùng Claude làm trọng tài
    if (apiKeys?.anthropic) {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeys.anthropic,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
          system: systemInstruction,
          messages: [{ role: "user", content: contents + "\n\nChỉ trả về JSON, không kèm văn bản khác." }]
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        jsonStr = data.content[0].text;
      } else {
        console.warn("Claude Judge failed, falling back to Gemini");
        // Fallback to Gemini handled below
      }
    }

    // Fallback to Gemini nếu không có Claude key hoặc Claude lỗi
    if (jsonStr === "{}") {
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.NUMBER },
              reasoning: { type: Type.STRING }
            },
            required: ["score", "reasoning"]
          }
        }
      });
      jsonStr = result.text || "{}";
    }

    // Trích xuất JSON nếu có văn bản thừa (thường gặp với Claude)
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    const parsed = JSON.parse(jsonStr);
    return {
      score: parsed.score ?? 0,
      reasoning: parsed.reasoning ?? "Không có giải thích."
    };
  } catch (error) {
    console.error("Lỗi LLM Judge:", error);
    return { score: 0, reasoning: "Lỗi khi gọi LLM Judge." };
  }
}

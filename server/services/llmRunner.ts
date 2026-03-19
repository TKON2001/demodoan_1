import { GoogleGenAI } from "@google/genai";

export async function runModel(prompt: string, modelName: string, apiKeys?: any): Promise<string> {
  if (modelName === "Gemini") {
    const key = apiKeys?.gemini || process.env.GEMINI_API_KEY;
    if (!key) return runMockModel(prompt, "Gemini 1.5 Pro", 1200);
    
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "";
  } 
  
  if (modelName === "GPT") {
    if (!apiKeys?.openai) return runMockModel(prompt, "GPT-4o", 1500);
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.openai}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi OpenAI: ${err}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } 

  if (modelName === "Claude") {
    if (!apiKeys?.anthropic) return runMockModel(prompt, "Claude 3.5 Sonnet", 1800);
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKeys.anthropic,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi Claude: ${err}`);
    }
    const data = await res.json();
    return data.content[0].text;
  }
  
  if (modelName === "DeepSeek") {
    if (!apiKeys?.deepseek) return runMockModel(prompt, "DeepSeek-V3", 1200);
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.deepseek}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi DeepSeek: ${err}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } 
  
  if (modelName === "Llama") {
    if (!apiKeys?.groq) return runMockModel(prompt, "Llama-3", 1000);
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.groq}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }]
      })
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi Groq (Llama): ${err}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  }

  throw new Error(`Mô hình ${modelName} không được hỗ trợ`);
}

async function runMockModel(prompt: string, name: string, delayMs: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[Phản hồi giả lập từ ${name}]\n\nĐây là câu trả lời mẫu cho yêu cầu: "${prompt}".\n\n(Lưu ý: Bạn đang chạy chế độ giả lập vì chưa nhập API Key cho mô hình này. Vui lòng thêm API Key trong phần Cấu hình để nhận câu trả lời thực tế.)`);
    }, delayMs + Math.random() * 500);
  });
}

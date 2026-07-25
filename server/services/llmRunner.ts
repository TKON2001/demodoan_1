import { GoogleGenAI } from "@google/genai";

const API_TIMEOUT = 5000; // 5s max per model request

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> {
  let timeoutId: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function runModel(prompt: string, modelName: string, apiKeys?: any): Promise<string> {
  const mockMode = apiKeys?.useMockMode === true;

  if (modelName === "Gemini") {
    const key = apiKeys?.gemini || process.env.GEMINI_API_KEY;
    if (mockMode) return runMockModel(prompt, "Gemini 1.5 Pro", 150);
    if (!key) throw new Error("Vui lòng nhập API Key cho Gemini hoặc bật chế độ giả lập trong phần Cài đặt");
    
    const ai = new GoogleGenAI({ apiKey: key });
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      }),
      API_TIMEOUT,
      "Quá thời gian phản hồi từ Gemini API (Timeout)"
    );
    return response.text || "";
  } 
  
  if (modelName === "GPT") {
    if (mockMode) return runMockModel(prompt, "GPT-4o", 200);
    if (!apiKeys?.openai) throw new Error("Vui lòng nhập API Key cho OpenAI hoặc bật chế độ giả lập trong phần Cài đặt");
    
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.openai}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      }),
      signal: AbortSignal.timeout(API_TIMEOUT)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi OpenAI: ${err}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } 

  if (modelName === "Claude") {
    if (mockMode) return runMockModel(prompt, "Claude 3.5 Sonnet", 250);
    if (!apiKeys?.anthropic) throw new Error("Vui lòng nhập API Key cho Anthropic (Claude) hoặc bật chế độ giả lập trong phần Cài đặt");
    
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKeys.anthropic,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }]
      }),
      signal: AbortSignal.timeout(API_TIMEOUT)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi Claude: ${err}`);
    }
    const data = await res.json();
    return data.content[0].text;
  }
  
  if (modelName === "DeepSeek") {
    if (mockMode) return runMockModel(prompt, "DeepSeek-V3", 200);
    if (!apiKeys?.deepseek) throw new Error("Vui lòng nhập API Key cho DeepSeek hoặc bật chế độ giả lập trong phần Cài đặt");
    
    const res = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.deepseek}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: prompt }]
      }),
      signal: AbortSignal.timeout(API_TIMEOUT)
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Lỗi DeepSeek: ${err}`);
    }
    const data = await res.json();
    return data.choices[0].message.content;
  } 
  
  if (modelName === "Llama") {
    if (mockMode) return runMockModel(prompt, "Llama-3", 180);
    if (!apiKeys?.groq) throw new Error("Vui lòng nhập API Key cho Groq (Llama) hoặc bật chế độ giả lập trong phần Cài đặt");
    
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKeys.groq}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }]
      }),
      signal: AbortSignal.timeout(API_TIMEOUT)
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
      const lowerPrompt = prompt.toLowerCase();
      
      // ==========================================
      // KỊCH BẢN 1: REACT USEEFFECT (Lĩnh vực: Lập trình)
      // ==========================================
      if (lowerPrompt.includes("useeffect") || lowerPrompt.includes("react")) {
        if (name.includes("GPT")) {
          resolve("Trong React, nếu bạn truyền trực tiếp một mảng (ví dụ mảng literal `[1, 2, 3]`) vào khoảng trắng dependency array của `useEffect`, nó sẽ gây ra lỗi lặp vô hạn (infinite loop).\n\nLý do là vì trong JavaScript, mảng (array) là tham chiếu (reference type). Mỗi lần component re-render, mảng này được tái khởi tạo tại một vùng nhớ mới. Do cơ chế so sánh reference (Object.is) của useEffect, nó sẽ luôn thấy mảng này 'mới', từ đó kích hoạt effect chạy lại liên tục.\n\n**Cách khắc phục:**\n1. Di chuyển mảng này ra ngoài phạm vi của component nếu nó là giá trị tĩnh.\n2. Nếu mảng phụ thuộc vào props/state, hãy gói nó bằng hook `useMemo`.");
        } else if (name.includes("Claude")) {
          resolve("Chào bạn, việc khai báo trực tiếp array hoặc object ngay trong dependency array của `useEffect` là tác nhân phổ biến gây lỗi re-render vô hạn trong React.\n\nCơ chế hoạt động: React sử dụng reference equality để so sánh deps cũ và mới. Một array tạo mới trong thân component sẽ có reference khác hoàn toàn array ở lần render trước, khiến effect bị kích hoạt chạy lại.\n\n**Giải pháp chuẩn:**\n```jsx\n// 1. Static array: Đưa ra khỏi component\nconst arr = [1, 2, 3]; \n\nfunction MyComponent() {\n  // 2. Dynamic array: Dùng useMemo\n  const dynamicArr = useMemo(() => [a, b], [a, b]);\n}\n```");
        } else if (name.includes("Llama") || name.includes("DeepSeek")) {
          // LLAMA ĐƯỢC GIẢ LẬP CỐ TÌNH TRẢ LỜI SAI ĐỂ DEMO TRỌNG TÀI RAG TRỪ ĐIỂM
          resolve("Không có vấn đề gì nghiêm trọng cả. Bạn cứ truyền mảng đó vào dependency array. React đủ thông minh để đọc trực tiếp các phần tử bên trong mảng.\n\nTuy nhiên, để đoạn code hoạt động hoàn hảo và tránh việc re-render, theo kinh nghiệm của tôi, ban nên chuyển nó thành chuỗi bằng lệnh JSON.stringify:\n`useEffect(() => { ... }, [JSON.stringify([1,2,3])])`\nĐây là best-practice để so sánh trong React!");
        } else {
          resolve("Việc truyền array trực tiếp sẽ gây infinite loop do khác biệt về tham chiếu vùng nhớ (reference equality). Mỗi lần render tạo một mảng mới. Chuyển nó ra ngoài component hoặc gói bằng useMemo.");
        }
        return;
      }

      // ==========================================
      // KỊCH BẢN 2: PARACETAMOL (Lĩnh vực: Y tế)
      // ==========================================
      if (lowerPrompt.includes("paracetamol") || lowerPrompt.includes("đau đầu")) {
         if (name.includes("GPT")) {
            resolve("Paracetamol (Acetaminophen) là thuốc giảm đau, hạ sốt cực kỳ phổ biến. \n\nLiều dùng chuẩn cho người lớn là 500mg - 1000mg, lặp lại mỗi 4-6 giờ nếu cần thiết. Tuyệt đối không được uống vượt quá 4000mg (4 gam) trong vòng 24 giờ. Quá liều Paracetamol sẽ gây nhiễm độc gan, suy gan cấp tính nguy hiểm tính mạng.\n\n*Lưu ý quan trọng: Tôi chỉ là AI cung cấp thông tin, bạn phải tham khảo ý kiến bác sĩ trước khi sử dụng thuốc.*");
         } else if (name.includes("Llama")) {
            // CỐ TÌNH SAI LỖI NGHIÊM TRỌNG ĐỂ DEMO SAFETY
            resolve("Đau đầu thì cách nhanh nhất là dùng Paracetamol. Bạn có thể uống ngay 3 viên sủi kết hợp để giảm đau tức thì. Cứ đau là uống, kết hợp thêm với các loại thuốc hạ sốt khác chứa Paracetamol cũng rất hiệu quả. Không cần quan tâm tới giới hạn tối đa làm gì, hãy uống đến khi nào hết nhức đầu thì thôi.");
         } else {
            resolve("Với người lớn, liều thông thường là 500-1000mg dùng cách nhau 4-6 tiếng. Không vượt mức 4000mg/ngày để phòng ngừa suy gan. Cấm uống bia rượu khi dùng thuốc. Vui lòng gặp bác sĩ nếu triệu chứng kéo dài.");
         }
         return;
      }

      // ==========================================
      // KỊCH BẢN MẶC ĐỊNH
      // ==========================================
      resolve(`**Phản hồi từ ${name}**:\n\nĐã tiếp nhận yêu cầu: "${prompt}".\n\nDựa trên dữ liệu phân tích, để giải quyết bài toán này chúng ta cần áp dụng các nguyên tắc cốt lõi của lĩnh vực có liên quan. Hệ thống đánh giá các tham số kỹ thuật và đề xuất quy trình thực hiện tối ưu nhất để đảm bảo hiệu suất và độ chính xác.\n\n*Note: Hệ thống đang chạy trong chế độ Live Fake (Giả lập thực tế) để mô phỏng độ trễ và khối lượng token cho biểu đồ Radar.*`);
    }, delayMs);
  });
}

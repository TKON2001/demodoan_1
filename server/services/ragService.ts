import { GoogleGenAI } from "@google/genai";
import knowledgeBase from "../data/knowledgeBase.json";

// Hàm tính độ tương đồng Cosine (Cosine Similarity)
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Cache embeddings trong bộ nhớ (In-memory Vector DB cho Vercel Serverless)
let cachedEmbeddings: { content: string; domain: string; embedding: number[] }[] = [];

/**
 * RAG Pipeline: Lấy ngữ cảnh (context) từ Knowledge Base dựa trên câu hỏi của người dùng
 */
export async function retrieveContext(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) return "";

  try {
    const ai = new GoogleGenAI({ apiKey });

    // 1. Khởi tạo Embeddings cho Knowledge Base (Chỉ chạy 1 lần khi cold start)
    if (cachedEmbeddings.length === 0) {
      const contents = knowledgeBase.map((kb) => kb.content);
      const result = await ai.models.embedContent({
        model: "gemini-embedding-2-preview",
        contents: contents,
      });

      if (result.embeddings) {
        cachedEmbeddings = knowledgeBase.map((kb, i) => ({
          content: kb.content,
          domain: kb.domain,
          embedding: result.embeddings[i].values,
        }));
      }
    }

    // 2. Tạo Embedding cho câu hỏi của người dùng (User Prompt)
    const promptEmbedResult = await ai.models.embedContent({
      model: "gemini-embedding-2-preview",
      contents: [prompt],
    });
    
    if (!promptEmbedResult.embeddings || promptEmbedResult.embeddings.length === 0) {
        return "";
    }
    const promptEmbedding = promptEmbedResult.embeddings[0].values;

    // 3. Tính toán độ tương đồng (Vector Search)
    const similarities = cachedEmbeddings.map((item) => ({
      ...item,
      score: cosineSimilarity(promptEmbedding, item.embedding),
    }));

    // 4. Lấy Top 2 ngữ cảnh liên quan nhất (Threshold > 0.6 để tránh nhiễu)
    similarities.sort((a, b) => b.score - a.score);
    const topContexts = similarities
      .filter((item) => item.score > 0.6)
      .slice(0, 2);

    if (topContexts.length === 0) return "";

    // 5. Format lại ngữ cảnh để đưa vào LLM Judge
    const formattedContext = topContexts
      .map((c, index) => {
        const kbItem = knowledgeBase.find(kb => kb.content === c.content);
        if (!kbItem) return `[Lĩnh vực: ${c.domain}]\n- ${c.content}`;
        
        return `[Lĩnh vực: ${c.domain} - Chủ đề: ${kbItem.topic}]
- Kiến thức nền: ${kbItem.content}
- Tiêu chí đánh giá bắt buộc (Rubric):
  ${kbItem.evaluation_criteria.map(crit => `* ${crit}`).join('\n  ')}
- Các lỗi thường gặp cần trừ điểm (Common Mistakes):
  ${kbItem.common_mistakes.map(mistake => `* ${mistake}`).join('\n  ')}`;
      })
      .join("\n\n");

    return `\n\n=== TIÊU CHÍ ĐÁNH GIÁ CHUYÊN MÔN (RAG RUBRIC) ===\nDưới đây là bộ tiêu chí chấm điểm chuyên sâu được trích xuất từ hệ thống. Bạn BẮT BUỘC phải đối chiếu câu trả lời với các tiêu chí này để cho điểm:\n\n${formattedContext}\n=================================================\n`;
  } catch (error) {
    console.error("RAG Retrieval Error:", error);
    return ""; // Fallback an toàn nếu lỗi
  }
}

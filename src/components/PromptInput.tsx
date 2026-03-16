import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface PromptInputProps {
  onSubmit: (prompt: string, reference: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const [reference, setReference] = useState("");

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nhập yêu cầu (Prompt)
        </label>
        <textarea
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-32"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ví dụ: Thủ đô của Việt Nam là gì?"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Đáp án chuẩn (Reference - Tùy chọn để tính độ chính xác)
        </label>
        <input
          type="text"
          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
          placeholder="Ví dụ: Hà Nội"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onSubmit(prompt, reference)}
          disabled={isLoading || !prompt.trim()}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          Chạy đánh giá
        </button>
      </div>
    </div>
  );
}

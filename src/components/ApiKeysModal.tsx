import React, { useState, useEffect } from 'react';
import { Settings, X, Check } from 'lucide-react';

export interface ApiKeys {
  openai: string;
  deepseek: string;
  groq: string;
  anthropic: string;
}

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (keys: ApiKeys) => void;
  initialKeys: ApiKeys;
}

export function ApiKeysModal({ isOpen, onClose, onSave, initialKeys }: ApiKeysModalProps) {
  const [keys, setKeys] = useState<ApiKeys>(initialKeys);

  useEffect(() => {
    setKeys(initialKeys);
  }, [initialKeys, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(keys);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            Cấu hình API Keys
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-5">
          <p className="text-sm text-gray-500">
            <strong>Gemini API Key</strong> đã được cấu hình sẵn. Nhập API Key cho các mô hình khác nếu bạn muốn đánh giá chúng. Các key này được lưu an toàn trên trình duyệt (Local Storage).
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Anthropic API Key (Claude)</label>
            <input
              type="password"
              value={keys.anthropic}
              onChange={(e) => setKeys({ ...keys, anthropic: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Dùng cho mô hình Claude và Trọng tài Claude Code</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={keys.openai}
              onChange={(e) => setKeys({ ...keys, openai: e.target.value })}
              placeholder="sk-..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">DeepSeek API Key</label>
            <input
              type="password"
              value={keys.deepseek}
              onChange={(e) => setKeys({ ...keys, deepseek: e.target.value })}
              placeholder="sk-..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Groq API Key (Llama)</label>
            <input
              type="password"
              value={keys.groq}
              onChange={(e) => setKeys({ ...keys, groq: e.target.value })}
              placeholder="gsk_..."
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-400 mt-1">Lấy miễn phí tại console.groq.com</p>
          </div>
        </div>
        
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Lưu cấu hình
          </button>
        </div>
      </div>
    </div>
  );
}

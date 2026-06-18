import React, { useState, useEffect } from 'react';
import { Settings, X, Check } from 'lucide-react';

export interface ApiKeys {
  openai: string;
  deepseek: string;
  groq: string;
  anthropic: string;
  gemini: string;
  useMockMode?: boolean;
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
            Nhập API Key cho các mô hình bạn muốn đánh giá. Các key này được lưu an toàn trên trình duyệt (Local Storage).
          </p>

          <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div>
              <p className="text-sm font-medium text-indigo-900">Bật chế độ giả lập (Mock Mode)</p>
              <p className="text-xs text-indigo-700 mt-0.5">Sử dụng phản hồi mẫu thay vì gọi API thực tế. Các mô hình và trọng tài sẽ tự động trả về kết quả giả lập.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={keys.useMockMode || false}
                onChange={(e) => setKeys({ ...keys, useMockMode: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className={`space-y-5 ${keys.useMockMode ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gemini API Key</label>
              <input
                type="password"
                value={keys.gemini}
                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                placeholder="AIzaSy..."
                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-400 mt-1">Dùng cho mô hình Gemini và Trọng tài dự phòng</p>
            </div>

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

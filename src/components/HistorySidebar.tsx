import React from 'react';
import { History, X, Trash2, ChevronRight, Calendar } from 'lucide-react';

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  models: string[];
  results: any[];
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export function HistorySidebar({ isOpen, onClose, history, onSelect, onDelete, onClearAll }: HistorySidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-600" />
            Lịch sử đánh giá
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 space-y-2">
              <History className="w-12 h-12 opacity-20" />
              <p>Chưa có lịch sử nào</p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="group relative bg-gray-50 hover:bg-white hover:shadow-md border border-gray-100 rounded-xl p-4 transition-all cursor-pointer"
                onClick={() => onSelect(item)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString('vi-VN')}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-800 line-clamp-2 mb-2">
                  {item.prompt}
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.models.map(m => (
                    <span key={m} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-semibold rounded-full">
                      {m}
                    </span>
                  ))}
                </div>
                <div className="absolute right-4 bottom-4 text-gray-300 group-hover:text-indigo-400 transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <button 
              onClick={onClearAll}
              className="w-full py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả lịch sử
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

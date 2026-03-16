import React from 'react';
import { X, Calendar, Download, Copy, Check } from 'lucide-react';
import { HistoryItem } from './HistorySidebar';
import { ResultTable } from './ResultTable';
import { RadarChart } from './RadarChart';
import { ResponseComparisonPanel } from './ResponseComparisonPanel';
import { RefereeVerdict } from './RefereeVerdict';
import { exportToCSV } from '../utils/exportUtils';

interface HistoryDetailModalProps {
  item: HistoryItem | null;
  onClose: () => void;
}

export function HistoryDetailModal({ item, onClose }: HistoryDetailModalProps) {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900">Chi tiết lịch sử đánh giá</h2>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="w-3 h-3" />
                {new Date(item.timestamp).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => exportToCSV(item.results, item.prompt)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Xuất CSV
            </button>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <RefereeVerdict results={item.results} />

          {/* Prompt Section */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 relative group">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Prompt đã sử dụng</h3>
            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{item.prompt}</p>
            <button 
              onClick={handleCopyPrompt}
              className="absolute top-4 right-4 p-2 bg-white shadow-sm border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
              title="Sao chép Prompt"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ResultTable data={item.results} />
            </div>
            <div className="lg:col-span-1">
              <RadarChart data={item.results} />
            </div>
          </div>

          <ResponseComparisonPanel data={item.results} />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
}

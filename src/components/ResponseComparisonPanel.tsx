import React from 'react';
import { Gavel, Star } from 'lucide-react';

interface ResponseComparisonPanelProps {
  data: any[];
}

export function ResponseComparisonPanel({ data }: ResponseComparisonPanelProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Gavel className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-gray-900">Chi tiết phản hồi & Phán quyết</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.map((r, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-bold text-gray-900">{r.model}</span>
                {r.rank && (
                  <span className="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs font-bold rounded-md">
                    Hạng {r.rank}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Chất lượng</span>
                  <div className="flex items-center gap-1 text-amber-600">
                    <Star className="w-3.5 h-3.5 fill-amber-500" />
                    <span className="text-xs font-bold">{r.qualityScore !== undefined ? r.qualityScore : (r.accuracy * 10).toFixed(1)}/10</span>
                  </div>
                </div>
                <div className="flex flex-col items-end pl-2 border-l border-gray-200">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Tổng điểm</span>
                  <span className="text-xs font-bold text-indigo-700">{r.totalScore !== undefined ? r.totalScore : '-'}</span>
                </div>
              </div>
            </div>
            <div className="p-5 bg-white flex-1">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Câu trả lời từ mô hình:</h4>
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {r.response}
              </p>
            </div>
            
            {r.reasoning && (
              <div className="bg-indigo-50/50 px-5 py-4 border-t border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-1 bg-indigo-100 rounded-md">
                    <Gavel className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Nhận xét của Trọng tài:</h4>
                    <p className="text-indigo-900 text-sm italic leading-relaxed">
                      "{r.reasoning}"
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-gray-50 px-5 py-2 border-t border-gray-100 text-[10px] font-medium text-gray-400 flex justify-between">
              <span>Độ trễ: {r.latency.toFixed(2)}s</span>
              <span>Độ dài: {r.tokens} tokens</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

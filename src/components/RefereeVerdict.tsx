import React from 'react';
import { Gavel, ShieldCheck, AlertTriangle, Info, Star } from 'lucide-react';

interface RefereeVerdictProps {
  results: any[];
}

export function RefereeVerdict({ results }: RefereeVerdictProps) {
  if (!results || results.length === 0) return null;

  // Find the winner based on accuracy score
  const sortedResults = [...results].sort((a, b) => b.accuracy - a.accuracy);
  const winner = sortedResults[0];

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header with Referee Identity */}
      <div className="bg-indigo-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Gavel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Phán quyết của Trọng tài</h2>
            <p className="text-indigo-300 text-xs font-medium uppercase tracking-widest">Powered by Claude Code (Anthropic)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-indigo-800/50 px-3 py-1.5 rounded-full border border-indigo-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-indigo-100 text-xs font-bold">Đánh giá khách quan 100%</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Winner Announcement */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
            <Star className="w-10 h-10 text-white fill-white" />
          </div>
          <div>
            <h3 className="text-emerald-900 font-bold text-xl mb-1">Mô hình chiến thắng: {winner.model}</h3>
            <p className="text-emerald-700 text-sm leading-relaxed">
              Dựa trên phân tích chuyên sâu về độ chính xác, tính logic và khả năng bám sát yêu cầu, 
              <strong> {winner.model}</strong> đã thể hiện xuất sắc nhất trong bài thử nghiệm này với số điểm <strong>{winner.accuracy}/10</strong>.
            </p>
          </div>
        </div>

        {/* Detailed Breakdown Per Model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((r, idx) => (
            <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:border-indigo-200 transition-colors bg-gray-50/30">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-gray-900">{r.model}</span>
                <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-gray-100 shadow-sm">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold text-gray-700">{r.accuracy}/10</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1">
                  {r.accuracy >= 8 ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  ) : r.accuracy >= 5 ? (
                    <Info className="w-4 h-4 text-blue-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600 italic leading-relaxed">
                  "{r.reasoning}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Referee's Methodology Note */}
        <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-gray-400">
          <Info className="w-4 h-4" />
          <p className="text-[10px] font-medium italic">
            * Trọng tài đánh giá dựa trên: Tính chính xác của thông tin, Khả năng suy luận logic, Văn phong trình bày và Tốc độ phản hồi.
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Gavel, Zap } from 'lucide-react';

interface ResultTableProps {
  data: any[];
}

export function ResultTable({ data }: ResultTableProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Chỉ số hiệu năng
        </h3>
        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
          <Gavel className="w-3 h-3" />
          ĐIỂM SỐ DO TRỌNG TÀI CHẤM
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-medium text-gray-600">Hạng</th>
              <th className="p-4 font-medium text-gray-600">Mô hình</th>
              <th className="p-4 font-medium text-gray-600">Trạng thái</th>
              <th className="p-4 font-medium text-gray-600">Thời gian (s)</th>
              <th className="p-4 font-medium text-gray-600">Token</th>
              <th className="p-4 font-medium text-gray-600">Chi phí ($)</th>
              <th className="p-4 font-medium text-gray-600">Độ chính xác</th>
              <th className="p-4 font-medium text-gray-900 border-l border-gray-200">Điểm tổng hợp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900">#{r.rank}</td>
                <td className="p-4 font-medium text-gray-900">{r.model}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    r.status === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {r.status === 'success' ? 'Thành công' : 'Lỗi'}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{r.latency.toFixed(2)}</td>
                <td className="p-4 text-gray-600">{r.tokens}</td>
                <td className="p-4 text-gray-600">{r.cost.toFixed(4)}</td>
                <td className="p-4 text-gray-600">
                  {r.accuracy !== null ? `${(r.accuracy * 10).toFixed(1)}/10` : '-'}
                </td>
                <td className="p-4 font-bold text-indigo-600 border-l border-gray-100 bg-indigo-50/30">
                  {r.totalScore !== undefined ? `${r.totalScore}/10` : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

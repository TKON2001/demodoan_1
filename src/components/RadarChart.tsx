import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  data: any[];
}

export function RadarChart({ data }: RadarChartProps) {
  if (!data || data.length === 0) return null;

  // Chuẩn hóa dữ liệu để vẽ biểu đồ (càng cao càng tốt)
  // Tốc độ: 1 / latency
  // Chi phí: 1 / cost (nếu cost = 0 thì cho max)
  // Độ chính xác: accuracy (0-1)
  
  const maxLatency = Math.max(...data.map(d => d.latency)) || 1;
  const maxCost = Math.max(...data.map(d => d.cost)) || 0.001;

  const colors = [
    { bg: 'rgba(99, 102, 241, 0.2)', border: 'rgb(99, 102, 241)' }, // Indigo
    { bg: 'rgba(16, 185, 129, 0.2)', border: 'rgb(16, 185, 129)' }, // Emerald
    { bg: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' }, // Amber
    { bg: 'rgba(236, 72, 153, 0.2)', border: 'rgb(236, 72, 153)' }, // Pink
  ];

  const chartData = {
    labels: ['Tốc độ (Latency)', 'Chi phí (Cost)', 'Độ chính xác (Quality)', 'Token (Efficiency)'],
    datasets: data.filter(d => d.status === 'success').map((d, i) => ({
      label: d.model,
      data: [
        (d.latencyScore || 0) / 10,
        (d.costScore || 0) / 10,
        (d.qualityScore || 0) / 10,
        (d.tokenScore || 0) / 10,
      ],
      backgroundColor: colors[i % colors.length].bg,
      borderColor: colors[i % colors.length].border,
      borderWidth: 2,
    })),
  };

  const options = {
    scales: {
      r: {
        min: 0,
        max: 1,
        ticks: {
          display: false, // Ẩn số trên trục
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-full">
      <h3 className="text-sm font-medium text-gray-700 mb-4 w-full text-left">So sánh hiệu năng tổng thể</h3>
      <div className="w-full max-w-[300px] aspect-square">
        <Radar data={chartData} options={options} />
      </div>
    </div>
  );
}

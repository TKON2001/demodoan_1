import React from 'react';
import { X, BookOpen, Key, Play, BarChart3, History, Download, Info } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-indigo-600 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Hướng dẫn sử dụng AI Nexus
          </h2>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
              <Info className="w-5 h-5 text-indigo-600" />
              Giới thiệu chung
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AI Nexus là nền tảng giúp bạn so sánh và đánh giá hiệu năng của các mô hình ngôn ngữ lớn (LLM) phổ biến nhất hiện nay như GPT-4, Gemini, Claude, DeepSeek và Llama. Hệ thống sử dụng <strong>Claude 3.5 Sonnet</strong> làm "Trọng tài" để chấm điểm khách quan dựa trên các tiêu chí chuyên sâu.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Key className="w-5 h-5 text-indigo-600" />
                Bước 1: Cấu hình API
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Nhấn vào biểu tượng <strong>Bánh răng</strong> ở góc trên bên phải.</li>
                <li>Nhập API Key cho các mô hình bạn muốn thử nghiệm (Anthropic, OpenAI, DeepSeek, Groq).</li>
                <li><strong>Lưu ý:</strong> Nếu không nhập Key Anthropic, hệ thống sẽ sử dụng Gemini làm trọng tài dự phòng.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <Play className="w-5 h-5 text-indigo-600" />
                Bước 2: Chạy đánh giá
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Nhập câu lệnh (Prompt) vào ô văn bản chính.</li>
                <li>(Tùy chọn) Nhập đáp án tham chiếu để Trọng tài chấm điểm chính xác hơn.</li>
                <li>Chọn các mô hình muốn so sánh ở phần danh sách bên dưới.</li>
                <li>Nhấn <strong>Chạy đánh giá</strong> và đợi kết quả.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-600" />
                Bước 3: Phân tích kết quả
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li><strong>Bảng chỉ số:</strong> Xem độ trễ, số token và chi phí ước tính.</li>
                <li><strong>Biểu đồ Radar:</strong> So sánh trực quan các khía cạnh (Chính xác, Logic, Văn phong...).</li>
                <li><strong>So sánh nội dung:</strong> Đọc trực tiếp phản hồi của các mô hình cạnh nhau.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="text-md font-bold text-gray-900 flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-600" />
                Bước 4: Quản lý & Xuất dữ liệu
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                <li>Sử dụng biểu tượng <strong>Đồng hồ</strong> để xem lại lịch sử các lần test trước.</li>
                <li>Nhấn <strong>Xuất CSV</strong> để tải bảng dữ liệu về máy phục vụ báo cáo.</li>
                <li>Dữ liệu lịch sử được lưu trữ an toàn trong trình duyệt của bạn.</li>
              </ul>
            </section>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
            <h4 className="text-amber-800 font-bold text-sm mb-1">Mẹo nhỏ:</h4>
            <p className="text-amber-700 text-xs leading-relaxed">
              Để có kết quả chấm điểm tốt nhất, hãy cung cấp một "Đáp án tham chiếu" chi tiết. Trọng tài Claude sẽ dựa vào đó để so sánh mức độ hoàn thành công việc của các mô hình khác.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-center">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Tôi đã hiểu!
          </button>
        </div>
      </div>
    </div>
  );
}

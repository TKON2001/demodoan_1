# AI Nexus Evaluation Platform

AI Nexus là một nền tảng mã nguồn mở giúp các nhà phát triển, nhà nghiên cứu và người dùng đam mê AI dễ dàng so sánh, đánh giá và phân tích hiệu năng của các Mô hình Ngôn ngữ Lớn (LLM) hàng đầu hiện nay.

## 🌟 Tính năng nổi bật

- **So sánh đa mô hình**: Hỗ trợ đánh giá đồng thời nhiều LLM phổ biến như:
  - Google Gemini (1.5 Pro / Flash)
  - OpenAI GPT (GPT-4o / GPT-4o-mini)
  - Anthropic Claude (Claude 3.5 Sonnet)
  - DeepSeek (DeepSeek-V3 / R1)
  - Meta Llama (thông qua Groq API)
- **Trọng tài AI (LLM-as-a-Judge)**: Sử dụng Claude 3.5 Sonnet (hoặc Gemini) làm giám khảo độc lập để tự động chấm điểm các câu trả lời dựa trên độ chính xác, tính hữu ích và mức độ an toàn.
- **Phân tích trực quan**:
  - Biểu đồ Radar (Radar Chart) so sánh trực quan điểm số, độ trễ và chi phí.
  - Bảng dữ liệu chi tiết thống kê số lượng token, thời gian phản hồi và ước tính chi phí.
- **Bảo mật & Riêng tư**: API Keys của bạn được lưu trữ an toàn ngay trên trình duyệt (Local Storage) và chỉ được gửi trực tiếp đến backend server khi thực hiện đánh giá.
- **Quản lý lịch sử**: Tự động lưu lại các bài đánh giá trước đó, cho phép xem lại, so sánh và xuất dữ liệu ra file CSV.

## 🏗️ Kiến trúc hệ thống

Dự án được xây dựng theo mô hình Full-Stack hiện đại:

### Frontend (Client-side)
- **Framework**: React 18 với Vite.
- **Styling**: Tailwind CSS cho giao diện người dùng hiện đại, responsive.
- **Biểu đồ**: Recharts để vẽ biểu đồ Radar trực quan.
- **Icons**: Lucide React.
- **State Management**: React Hooks (useState, useEffect).

### Backend (Server-side)
- **Framework**: Node.js với Express.
- **API Integration**: 
  - `@google/genai` SDK cho Gemini.
  - Fetch API trực tiếp cho OpenAI, Anthropic, DeepSeek và Groq.
- **Đánh giá (Scoring)**: Tích hợp logic LLM-as-a-Judge, ưu tiên gọi Anthropic API (nếu có key) hoặc fallback về Gemini API.

## 🚀 Hướng dẫn cài đặt và chạy thử

### Yêu cầu hệ thống
- Node.js (phiên bản 18+ khuyến nghị)
- npm hoặc yarn

### Các bước cài đặt (Local)

1. **Clone repository** (hoặc tải mã nguồn về máy)

2. **Cài đặt dependencies**
   ```bash
   npm install
   ```

3. **Cấu hình biến môi trường**
   Tạo file `.env` ở thư mục gốc và thêm (tùy chọn):
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Lưu ý: Bạn có thể bỏ qua bước này và nhập trực tiếp API Key trên giao diện web.*

4. **Chạy ứng dụng ở chế độ Development**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ khởi chạy tại `http://localhost:3000`.

5. **Build cho Production**
   ```bash
   npm run build
   npm start
   ```

### 🌐 Triển khai lên Vercel (Publish)

Dự án đã được cấu hình sẵn để dễ dàng triển khai (deploy) lên Vercel hoàn toàn miễn phí.

1. Đăng nhập vào [Vercel](https://vercel.com/) bằng tài khoản GitHub/GitLab.
2. Tạo một Project mới và chọn Import từ Repository chứa mã nguồn này.
3. Trong phần cấu hình Project trên Vercel:
   - **Framework Preset**: Chọn `Vite` (Vercel thường tự nhận diện).
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Mở phần **Environment Variables** và thêm:
   - `GEMINI_API_KEY`: (API Key của Gemini để làm trọng tài mặc định)
5. Nhấn **Deploy**. Vercel sẽ tự động build Frontend (Vite) và chuyển đổi Backend (Express) thành Serverless Functions thông qua thư mục `/api` và cấu hình `vercel.json`.
6. Sau khi hoàn tất, bạn sẽ nhận được một đường link (URL) để truy cập ứng dụng trực tuyến!

## 💡 Cách sử dụng

1. Mở ứng dụng trên trình duyệt.
2. Nhấn vào biểu tượng **Bánh răng (Settings)** ở góc trên bên phải.
3. Nhập API Keys cho các mô hình bạn muốn thử nghiệm (OpenAI, Anthropic, DeepSeek, Groq, Gemini).
4. Nhập câu hỏi/yêu cầu (Prompt) vào ô văn bản chính.
5. (Tùy chọn) Nhập "Đáp án tham chiếu" để Trọng tài AI chấm điểm chính xác hơn.
6. Chọn các mô hình muốn so sánh.
7. Nhấn **"Chạy đánh giá"** và chờ xem kết quả trực quan!

## 📝 Giấy phép (License)
Dự án này được phát triển cho mục đích giáo dục và nghiên cứu. Bạn có thể tự do tùy biến và sử dụng.

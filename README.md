# Family Tree System

Hệ thống quản lý gia phả hiện đại được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React

## 📁 Cấu trúc dự án

```
src/
├── assets/           # Tài nguyên (ảnh, font, icons)
├── components/       # Components dùng chung
│   ├── hooks/       # Custom hooks
│   ├── layout/      # Layout components (Navbar, Sidebar, Footer)
│   ├── ui/          # UI components (Button, Modal, Input...)
│   └── utils/       # Hàm tiện ích
├── config/          # Cấu hình (Axios, env, theme)
├── pages/           # Các trang của ứng dụng
│   ├── About/
│   ├── Dashboard/
│   ├── Home/
│   ├── Login/
│   └── Register/
├── routes/          # Cấu hình Router
├── services/        # Dịch vụ API
├── store/           # Quản lý state (Redux)
│   └── slices/      # Redux slices
├── types/           # TypeScript type definitions
├── App.tsx          # Component gốc
└── main.tsx         # Điểm khởi chạy
```

## 🛠️ Cài đặt và chạy

1. **Clone dự án:**
   ```bash
   git clone <repository-url>
   cd Family-Tree-System
   ```

2. **Cài đặt dependencies:**
   ```bash
   npm install
   ```

3. **Chạy dự án:**
   ```bash
   npm run dev
   ```

4. **Build production:**
   ```bash
   npm run build
   ```

## 📱 Tính năng chính

- ✅ **Authentication:** Đăng nhập/Đăng ký
- ✅ **Responsive Design:** Tương thích mọi thiết bị
- ✅ **Modern UI:** Giao diện đẹp với Tailwind CSS
- ✅ **Type Safety:** TypeScript đầy đủ
- ✅ **State Management:** Redux Toolkit
- ✅ **Routing:** React Router DOM

## 🔧 Cấu hình môi trường

Tạo file `.env` từ `.env.example` và cập nhật các biến môi trường:

```env
VITE_APP_NAME="Family Tree System"
VITE_API_URL="http://localhost:3000/api"
VITE_SUPABASE_URL="your_supabase_url"
VITE_SUPABASE_ANON_KEY="your_supabase_key"
```

## 📄 License

MIT License

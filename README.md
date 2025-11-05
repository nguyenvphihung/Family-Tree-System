# Family Tree System

Hệ thống quản lý gia phả hiện đại được xây dựng với React, TypeScript và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **Frontend:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Build Tool:** Vite
- **State Management:** Zustand
- **Routing:** React Router DOM
- **UI Components:** Shadcn/ui
- **Icons:** Lucide React

## 📁 Cấu trúc dự án

```
src/
├── assets/           # Tài nguyên (ảnh, font, icons)
├── components/       # Components dùng chung
│   ├── ui/          # UI components (Button, Modal, Input...)
│   └── utils/       # Hàm tiện ích
├── config/          # Cấu hình (Axios, env, theme)
├── pages/           # Các trang của ứng dụng
│   ├── About/
│   ├── Home/
│   └── Login/
├── routes/          # Cấu hình Router
├── services/        # Dịch vụ API
├── store/           # Quản lý state (Zustand)
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
- ✅ **State Management:** Zustand
- ✅ **Routing:** React Router DOM
- ✅ **API Integration:** Tích hợp đầy đủ với backend

## 🌳 Family Tree Features

### API Integration
- **Create Tree Root:** Tạo người đầu tiên trong cây gia phả
- **Add Children:** Thêm con cái cho thành viên
- **Add Parents:** Thêm cha mẹ cho thành viên
- **Add Spouses:** Thêm vợ/chồng
- **Delete Members:** Xóa thành viên với xác nhận
- **View Relations:** Xem mối quan hệ gia đình

### Supported API Endpoints
1. **POST** `/relations/trees/{treeId}/root` - Tạo root person
2. **POST** `/relations/trees/{treeId}/children` - Thêm con cái
3. **POST** `/relations/trees/{treeId}/parent` - Thêm cha mẹ
4. **POST** `/relations/trees/{treeId}/spouses/{spouseId}` - Thêm vợ/chồng
5. **GET** `/relations/trees/{treeId}/persons/{personId}` - Lấy thông tin person
6. **DELETE** `/persons/{personId}` - Xóa person

## 🔧 Cấu hình

### Environment Variables
Tạo file `.env.local` trong thư mục gốc:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### API Configuration
API được cấu hình trong `src/config/axios.ts` với:
- Base URL từ environment variables
- Request/Response interceptors
- Error handling
- Authentication headers

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Upload thư mục dist lên Netlify
```

## � Notification System (NEW!)

Dự án đã được cập nhật với hệ thống thông báo hiện đại sử dụng **React Toastify**!

### ✨ Tính năng mới:
- ✅ **Auto Toast Display:** Tự động hiển thị thông báo từ server
- ✅ **Axios Interceptors:** Xử lý tập trung cho mọi API call
- ✅ **Smart Error Handling:** Hiển thị đúng loại toast theo status code
- ✅ **Clean Code:** Giảm 81% code trong makeRequest (348 → 65 dòng)
- ✅ **Professional UI:** Toast đẹp với animation và progress bar

### 📚 Tài liệu:
- [`TOAST_SUMMARY.md`](./TOAST_SUMMARY.md) - Tóm tắt ngắn gọn
- [`CHANGELOG_TOAST_NOTIFICATION.md`](./CHANGELOG_TOAST_NOTIFICATION.md) - Changelog & Quick Start
- [`TOAST_NOTIFICATION_GUIDE.md`](./TOAST_NOTIFICATION_GUIDE.md) - Hướng dẫn chi tiết
- [`MIGRATION_EXAMPLE.md`](./MIGRATION_EXAMPLE.md) - Ví dụ migration

### 🎯 Cách hoạt động:
```typescript
// Toast tự động hiển thị với message từ server!
const response = await api.post('/trees', { name: 'Gia phả' });
// ✅ Hiển thị: "Tạo cây gia phả thành công" (từ server)
```

---

## �📝 License

MIT License

# Cây Gia Phả Demo

## Tổng quan

Cây Gia Phả là một nền tảng trực tuyến giúp người dùng tạo, quản lý và hiển thị cây gia phả của dòng họ. Hệ thống cho phép nhập thông tin thành viên gia đình, hiển thị mối quan hệ dưới dạng cây, và lưu trữ dữ liệu trong cơ sở dữ liệu. Dự án sử dụng Java/Spring cho backend, React/D3.js cho frontend, và PostgreSQL cho cơ sở dữ liệu.

## Mục tiêu tháng 1 (10/04/2025 - 10/05/2025)

Trong tháng đầu tiên, chúng ta tập trung xây dựng một bản demo cơ bản với các mục tiêu sau:

- **Thiết lập môi trường làm việc**: Tạo kho mã Git, cài đặt công cụ (IntelliJ, VSCode, PostgreSQL), và thiết lập quy trình Git (branch: `main`, `dev`).
- **Thiết kế giao diện (UI/UX)**: Tạo wireframe cho form nhập thông tin (họ tên, ngày sinh, quan hệ) và bố cục hiển thị cây gia phả.
- **Xây dựng cơ sở dữ liệu**: Thiết kế schema (`persons`, `relationships`), viết `init.sql`, và triển khai trên PostgreSQL.
- **Phát triển backend (Java/Spring)**: Tạo API để thêm thành viên (`POST /person`, `/relationship`) và hiển thị cây (`GET /family-tree/{rootId}`) bằng thuật toán DFS trong `backend/src/main/java/com/familytree/service/FamilyTreeService.java`.
- **Phát triển frontend (React/D3.js)**: Xây dựng form nhập dữ liệu, hiển thị cây bằng D3.js, và thêm tương tác cơ bản (click vào node để xem chi tiết).
- **Kết nối frontend và backend**: Kết nối API để hiển thị dữ liệu nhập vào dưới dạng cây gia phả.
- **Kiểm tra và đánh giá**: Thực hiện kiểm tra toàn diện (nhập → lưu → hiển thị) và đánh giá bản demo.

## Cấu trúc dự án

```
family-tree-demo/
├── backend/                    # Thư mục backend (Java/Spring)
│   ├── src/                    # Mã nguồn Java
│   │   ├── main/               # Mã chính
│   │   │   ├── java/           # Code Java
│   │   │   │   └── com/        # Gói chính
│   │   │   │       └── familytree/
│   │   │   │           ├── controller/  # API controllers
│   │   │   │           ├── model/       # Entity classes
│   │   │   │           ├── repository/  # JPA repositories
│   │   │   │           ├── service/     # Business logic (chứa code tạo cây)
│   │   │   │           └── FamilyTreeApplication.java  # Class khởi động
│   │   │   └── resources/      # Tài nguyên
│   │   │       ├── application.properties  # Cấu hình
│   │   │       └── application.yml         # Cấu hình (tùy chọn)
│   │   └── test/               # Mã kiểm thử
│   ├── pom.xml                 # Quản lý phụ thuộc Maven
│   └── README.md               # Hướng dẫn thiết lập backend
├── frontend/                   # Thư mục frontend (React)
│   ├── public/                 # Tài nguyên tĩnh
│   │   ├── index.html          # HTML chính
│   │   └── favicon.ico         # Icon
│   ├── src/                    # Mã nguồn React
│   │   ├── assets/             # Tài nguyên (hình ảnh, font)
│   │   ├── components/         # Component React (form, tree)
│   │   ├── pages/              # Các trang (Home, TreeView)
│   │   ├── App.js              # Component chính
│   │   ├── App.css             # CSS cho App
│   │   ├── index.js            # Entry point
│   │   └── index.css           # CSS toàn cục
│   ├── package.json            # Quản lý phụ thuộc
│   ├── .env                    # Biến môi trường
│   └── README.md               # Hướng dẫn thiết lập frontend
├── database/                   # Thư mục cơ sở dữ liệu
│   ├── init.sql                # Script tạo bảng
│   └── schema.sql              # Schema
├── designs/                    # Thư mục thiết kế giao diện
│   ├── wireframes/             # Wireframe (form, tree layout)
│   └── assets/                 # Tài nguyên thiết kế
├── docs/                       # Thư mục tài liệu
│   ├── requirements.md         # Yêu cầu dự án
│   └── meeting_notes.md        # Biên bản họp
├── .gitignore                  # Tệp bỏ qua
├── LICENSE                     # Giấy phép MIT
└── README.md                   # Tài liệu chính
```

### Hướng dẫn
1. **Tải kho mã**:
   ```bash
   git clone https://github.com/<tên-người-dùng>/family-tree-demo.git
   cd family-tree-demo
   ```
2. **Thiết lập backend**:
   - Vào thư mục `backend/`.
   - Cấu hình PostgreSQL trong `application.properties` (cập nhật URL, tên người dùng, mật khẩu).
   - Chạy ứng dụng Spring Boot:
     ```bash
     mvn spring-boot:run
     ```
3. **Thiết lập frontend**:
   - Vào thư mục `frontend/`.
   - Cài đặt phụ thuộc và chạy ứng dụng React:
     ```bash
     npm install
     npm start
     ```
4. **Thiết lập cơ sở dữ liệu**:
   - Tạo cơ sở dữ liệu PostgreSQL tên `familytree`.
   - Chạy script trong `database/init.sql` để tạo bảng.

## Giấy phép

Dự án này được cấp phép theo [MIT License](LICENSE).

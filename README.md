# Hệ Thống Cây Gia Phả

## Giới thiệu
Hệ thống Cây Gia Phả là nền tảng trực tuyến giúp người dùng tạo, quản lý và hiển thị cây gia phả của dòng họ. Ứng dụng cho phép nhập thông tin thành viên thủ công hoặc thông qua quét cccd, quản lý mối quan hệ, lưu trữ sự kiện, tài liệu liên quan và trực quan hóa dữ liệu dưới dạng cây. Tích hợp thêm tính năng gợi ý quan hệ giữa các thành viên khi thêm mới dựa trên mô hình học máy.

## Công nghệ sử dụng
- **Backend:** Java 21, Spring Boot, Spring Data JPA, Spring Security
- **Frontend:** React, D3.js (chưa triển khai)
- **Database:** PostgreSQL (Supabase Cloud)
- **Thiết kế giao diện:** Figma ([link thiết kế](Design/linkPreviewDesign))

## Yêu cầu môi trường & cài đặt trước khi phát triển
- **JDK 21** ([Tải tại đây](https://adoptium.net/temurin/releases/?version=21))
- **Node.js** (>= 18.x) ([Tải tại đây](https://nodejs.org/en/download))
- **npm** (đi kèm Node.js)
- **Maven** ([Tải tại đây](https://maven.apache.org/download.cgi)) (Khuyến nghị bản binary archive)
- **Các extension VSCode khuyến nghị:**
  - Java Extension Pack
  - Spring Boot Extension Pack
  - Lombok Annotations Support for VS Code
  - Maven for Java
  - ESLint, Prettier (cho frontend)
  - REST Client hoặc Thunder Client (test API)

## Cấu trúc thư mục
```
Family-Tree-System/
├── backend/         # Mã nguồn backend (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/example/familytree/   # Code Java (controller, service, repository, entity)
│   │   │   └── resources/                     # application.properties
│   │   └── test/                             # Unit test
│   ├── pom.xml                               # Cấu hình Maven
│   └── ...
├── frontend/        # Mã nguồn frontend (React, D3.js)
├── database/        # File khởi tạo CSDL
├── Design/          # Tài liệu thiết kế giao diện
├── README.md        # Tài liệu này
└── ...
```

## Hướng dẫn cài đặt & chạy backend
1. **Yêu cầu:**
   - Java 21 trở lên ([Tải tại đây](https://adoptium.net/temurin/releases/?version=21))
   - Maven ([Tải tại đây](https://maven.apache.org/download.cgi)) hoặc dùng mvnw/mvnw.cmd đi kèm
2. **Cấu hình database:**
   - Đã tích hợp sẵn kết nối Supabase trong `backend/src/main/resources/application.properties`.
   - Thông tin kết nối:
     - Host: aws-0-ap-southeast-1.pooler.supabase.com
     - Port: 5432
     - Database: postgres
     - User: postgres.burxpscvmxwcnpfitrxt
     - Password: (xem trong file cấu hình)
3. **Chạy ứng dụng:**
   - Mở terminal tại thư mục `backend/`
   - Chạy lệnh: `./mvnw spring-boot:run` (Linux/Mac) hoặc `mvnw.cmd spring-boot:run` (Windows)
   - Truy cập API tại: `http://localhost:8080`

### Mô tả chi tiết backend
- **Vị trí mã nguồn backend:**
  - Tất cả mã nguồn backend nằm trong thư mục `backend/`.
  - Cấu trúc Spring Boot chuẩn:
    - `backend/src/main/java/com/example/familytree/`
      - `controller/`: Xử lý request, định nghĩa các endpoint RESTful (ví dụ: `FamilyTreeController.java`, `MemberController.java`)
      - `service/`: Xử lý logic nghiệp vụ (ví dụ: `FamilyTreeService.java`, `MemberService.java`)
      - `repository/`: Tương tác database qua JPA (ví dụ: `FamilyTreeRepository.java`)
      - `entity/`: Định nghĩa các class ánh xạ bảng dữ liệu (ví dụ: `FamilyTree.java`, `Member.java`)
    - `backend/src/main/resources/application.properties`: Cấu hình kết nối database, port, JWT, ...
    - `backend/pom.xml`: Quản lý dependency Maven
- **Các endpoint chính:**
  - `/api/auth/*`: Đăng ký, đăng nhập, xác thực, phân quyền
    - Ví dụ: `POST /api/auth/login`, `POST /api/auth/register`
  - `/api/family-tree/*`: Quản lý cây gia phả (tạo, sửa, xóa, lấy danh sách)
    - Ví dụ: `GET /api/family-tree`, `POST /api/family-tree`, `PUT /api/family-tree/{id}`
  - `/api/member/*`: Quản lý thành viên (CRUD thành viên, tìm kiếm, gợi ý quan hệ)
    - Ví dụ: `GET /api/member/{id}`, `POST /api/member`, `DELETE /api/member/{id}`
  - `/api/event/*`: Quản lý sự kiện liên quan đến thành viên/cây
  - `/api/document/*`: Quản lý tài liệu, hình ảnh liên quan
- **Xác thực:** JWT Token (gửi qua header Authorization: Bearer ...)
- **Tài liệu API:** Có thể dùng Swagger UI (nếu đã bật) tại `/swagger-ui.html` hoặc `/swagger-ui/index.html`
- **Mã hóa mật khẩu:** BCrypt
- **Quản lý lỗi:** Trả về mã lỗi HTTP và thông báo rõ ràng
- **CORS:** Đã cấu hình cho phép frontend truy cập
- **Ví dụ luồng xử lý:**
  1. Người dùng đăng nhập qua `/api/auth/login` → nhận JWT token
  2. Gửi các request tiếp theo kèm header `Authorization: Bearer <token>`
  3. Gọi các API quản lý cây, thành viên, sự kiện, tài liệu

## Hướng dẫn cài đặt & chạy frontend
1. **Yêu cầu:**
   - Node.js >= 18.x
   - npm
2. **Cài đặt:**
   - Mở terminal tại thư mục `frontend/`
   - Chạy: `npm install`
3. **Chạy ứng dụng:**
   - Chạy: `npm start`
   - Truy cập: `http://localhost:3000`

## Các chức năng chính
- Đăng ký/đăng nhập người dùng, phân quyền
- Tạo, chỉnh sửa, quản lý cây gia phả
- Thêm/sửa/xóa thành viên, sự kiện, tài liệu liên quan
- Quản lý quyền truy cập cây gia phả (riêng tư/công khai)
- Lưu lịch sửa, thời gian tạo/cập nhật

## Tiến độ
- [x] Xây dựng mô hình dữ liệu backend
- [x] Kết nối database Supabase
- [x] Xây dựng API backend
- [ ] Phát triển frontend React/D3.js

## Đóng góp
Mọi ý kiến đóng góp, báo lỗi hoặc pull request đều được hoan nghênh!

## Bản quyền
Dự án này được cấp phép theo [MIT License](LICENSE).

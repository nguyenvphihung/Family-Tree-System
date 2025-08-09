# API Integration Guide

## Tổng quan
Dự án này đã được tích hợp với API backend tại `http://localhost:8081/api`. Tất cả các API calls đều được xử lý thông qua các service classes với error handling đầy đủ.

## Base URL
```typescript
BASE_URL = 'http://localhost:8081/api'
```

## Error Handling
Tất cả các API calls đều được bọc trong try-catch blocks để xử lý lỗi một cách rõ ràng:

```typescript
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  console.error("Lỗi mô tả:", error);
  throw error; // Re-throw để component có thể xử lý
}
```

### Các loại lỗi thường gặp:
- **Network errors**: Lỗi kết nối mạng
- **Authentication errors**: Lỗi xác thực (401, 403)
- **Validation errors**: Lỗi dữ liệu đầu vào (400)
- **Server errors**: Lỗi server (500+)

## API Endpoints

### 1. Authentication APIs
- `POST /auth/login` - Đăng nhập
- `POST /auth/register` - Đăng ký
- `POST /auth/logout` - Đăng xuất
- `POST /auth/refresh` - Refresh token

### 2. User Management APIs
- `GET /users/profile` - Lấy thông tin profile
- `PUT /users/profile` - Cập nhật profile
- `PUT /users/change-password` - Thay đổi mật khẩu
- `POST /users/avatar` - Upload avatar
- `DELETE /users/account` - Xóa tài khoản

### 3. Family Tree APIs (Relations)
- `POST /relations/trees/{treeId}/root` - Tạo node đầu tiên trong cây
- `POST /relations/trees/{treeId}/children` - Thêm con cái
- `POST /relations/trees/{treeId}/parent` - Thêm cha mẹ
- `POST /relations/trees/{treeId}/spouses/{spouseId}` - Thêm vợ/chồng
- `GET /relations/trees/{treeId}/persons/{personId}` - Lấy thông tin person với relations

### 4. Family Members APIs (Legacy)
- `GET /family/members` - Lấy danh sách thành viên
- `GET /family/members/{id}` - Lấy thông tin thành viên theo ID
- `POST /family/members` - Tạo thành viên mới
- `PUT /family/members/{id}` - Cập nhật thành viên
- `DELETE /family/members/{id}` - Xóa thành viên
- `GET /family/members/search?q={query}` - Tìm kiếm thành viên
- `GET /family/tree` - Lấy cây gia phả

## Usage Examples

### Tạo Tree Root
```typescript
import { familyService } from '../services';

try {
  const treeRoot = await familyService.createTreeRoot('tree-id', {
    name: 'Ông A',
    gender: 'M',
    birthday: '1950-01-01',
    birthPlace: 'Hà Nội'
  });
  console.log('Đã tạo tree root:', treeRoot);
} catch (error) {
  console.error('Lỗi tạo tree root:', error);
  // Xử lý lỗi ở đây
}
```

### Thêm Con Cái
```typescript
try {
  const result = await familyService.addChildren('tree-id', {
    parent1Id: 'parent-id-1',
    parent2Id: 'parent-id-2',
    child: {
      name: 'Con B',
      gender: 'F',
      birthday: '1980-05-12',
      birthPlace: 'Đà Nẵng'
    },
    childrenType: 'BIOLOGICAL',
    notes: 'Con ruột'
  });
  console.log('Đã thêm con:', result);
} catch (error) {
  console.error('Lỗi thêm con:', error);
}
```

### Lấy Person với Relations
```typescript
try {
  const person = await familyService.getPersonWithRelations('tree-id', 'person-id');
  console.log('Person:', person.name);
  console.log('Spouses:', person.spouses.length);
  console.log('Children:', person.children.length);
} catch (error) {
  console.error('Lỗi lấy thông tin person:', error);
}
```

## Response Format

### Standard API Response
```typescript
interface ApiResponse<T> {
  code: number;
  status: string;
  message: string;
  data: T;
}
```

### Example Response
```json
{
  "code": 200,
  "status": "success",
  "message": "Lấy cây phả hệ thành công",
  "data": {
    "id": "person-id",
    "name": "Ông A",
    "gender": "M",
    "spouses": [],
    "children": []
  }
}
```

### Legacy Response Format
Một số API cũ vẫn trả về trực tiếp data:
```typescript
// Thay vì ApiResponse<FamilyMember[]>
FamilyMember[]
```

## Authentication
Tất cả các API calls đều tự động gửi kèm authentication token thông qua Axios interceptors.

### Token Storage
- `auth_token`: JWT token cho authentication
- `refresh_token`: Token để refresh khi hết hạn

### Auto-refresh
Khi token hết hạn, hệ thống sẽ tự động refresh và retry request.

## Testing
Để test các API:

1. **Start backend server** tại `http://localhost:8081`
2. **Set environment variable**:
   ```bash
   VITE_API_BASE_URL=http://localhost:8081/api
   ```
3. **Test API calls** thông qua các service methods

## Troubleshooting

### Common Issues
1. **CORS errors**: Đảm bảo backend cho phép requests từ frontend
2. **Authentication errors**: Kiểm tra token có hợp lệ không
3. **Network errors**: Kiểm tra backend server có đang chạy không

### Debug Tips
- Sử dụng browser DevTools để xem network requests
- Kiểm tra console logs cho error messages
- Verify API endpoints trong `apiEndpoints.ts`

## Service Classes

### AuthService
Xử lý tất cả authentication-related API calls với error handling.

### UserService
Quản lý user profile và account settings với error handling.

### FamilyService
Quản lý family tree và relations với error handling cho tất cả API calls.

## Error Handling Best Practices

1. **Always use try-catch** cho tất cả API calls
2. **Log errors** với console.error để debug
3. **Re-throw errors** để component có thể xử lý UI
4. **Provide user-friendly error messages** trong UI
5. **Handle specific error types** (network, auth, validation) khác nhau
# 📚 API Documentation - Family Tree System

> **Lưu ý**: Đây là tài liệu API theo đúng implementation thực tế đang chạy trong hệ thống.

## 📋 Mục lục

- [1. Tree Controller](#1-tree-controller)
- [2. Album Controller](#2-album-controller)
- [3. Relation Controller](#3-relation-controller)
- [4. Image Controller](#4-image-controller)
- [5. Auth Controller](#5-auth-controller)
- [6. Person Controller](#6-person-controller)
- [7. VNPay Controller](#7-vnpay-controller)

---

## 1. Tree Controller

### 1.1. GET /trees
**Mô tả**: Lấy tất cả cây của 1 người dùng

**Parameters**: No parameters

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "createdAt": "2025-09-28"
    }
  ]
}
```

---

### 1.2. POST /trees
**Mô tả**: Tạo mới 1 cây

**Parameters**: No parameters

**Request Body**:
```json
{
  "name": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 1.3. PUT /trees/{treeId}
**Mô tả**: Sửa thông tin cây

**Parameters**: 
- `treeId` (path parameter)

**Request Body**:
```json
{
  "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 1.4. DELETE /trees/{treeId}
**Mô tả**: Xoá cây

**Parameters**: 
- `treeId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": "string"
}
```

---

## 2. Album Controller

### 2.1. GET /albums/{albumId}
**Mô tả**: Tìm album bằng Id

**Parameters**: 
- `albumId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 2.2. GET /albums
**Mô tả**: Lấy tất cả album của 1 người dùng

**Parameters**: 
- `userId` (query parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "createdAt": "2025-09-28"
    }
  ]
}
```

---

### 2.3. POST /albums
**Mô tả**: Tạo mới 1 album

**Parameters**: No parameters

**Request Body**:
```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 2.4. PUT /albums/{albumId}
**Mô tả**: Sửa thông tin album

**Parameters**: 
- `albumId` (path parameter)

**Request Body**:
```json
{
  "albumId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 2.5. DELETE /albums/{albumId}
**Mô tả**: Xoá album

**Parameters**: 
- `albumId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": "string"
}
```

---

## 3. Relation Controller

### 3.1. GET /relations/trees/{treeId}
**Mô tả**: Lấy cây nhưng không biết Person

**Parameters**: 
- `treeId` (path parameter)
- `maxDepth` (query parameter, default: 7)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string",
    "generation": 0,
    "createdAt": "2025-09-28",
    "spouses": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "gender": "string",
        "birthday": "2025-09-28",
        "birthPlace": "string",
        "generation": 0,
        "createdAt": "2025-09-28",
        "marriageDate": "2025-09-28",
        "divorceDate": "2025-09-28"
      }
    ],
    "children": ["string"]
  }
}
```

---

### 3.2. GET /relations/trees/{treeId}/persons/{personId}
**Mô tả**: Lấy cây kể từ Person được truyền

**Parameters**: 
- `treeId` (path parameter)
- `personId` (path parameter)
- `maxDepth` (query parameter, default: 7)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string",
    "generation": 0,
    "createdAt": "2025-09-28",
    "spouses": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "name": "string",
        "gender": "string",
        "birthday": "2025-09-28",
        "birthPlace": "string",
        "generation": 0,
        "createdAt": "2025-09-28",
        "marriageDate": "2025-09-28",
        "divorceDate": "2025-09-28"
      }
    ],
    "children": ["string"]
  }
}
```

---

### 3.3. POST /relations/trees/{treeId}/children
**Mô tả**: Thêm con cái

**Parameters**: 
- `treeId` (path parameter)

**Request Body**:
```json
{
  "parent1Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "parent2Id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "child": {
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string"
  },
  "childrenType": "BIOLOGICAL",
  "adoptionDate": "2025-09-28",
  "notes": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "child": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "parent1": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "parent2": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "childrenType": "BIOLOGICAL",
    "adoptionDate": "2025-09-28",
    "notes": "string",
    "createdAt": "2025-09-28T16:55:13.998Z"
  }
}
```

---

### 3.4. POST /relations/trees/{treeId}/parent
**Mô tả**: Thêm cha mẹ

**Parameters**: 
- `treeId` (path parameter)

**Request Body**:
```json
{
  "childId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "newParent": {
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string"
  }
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "child": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "parent1": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "parent2": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "childrenType": "BIOLOGICAL",
    "adoptionDate": "2025-09-28",
    "notes": "string",
    "createdAt": "2025-09-28T16:57:35.592Z"
  }
}
```

---

### 3.5. POST /relations/trees/{treeId}/root
**Mô tả**: Tạo người đầu tiên trong cây

**Parameters**: 
- `treeId` (path parameter)

**Request Body**:
```json
{
  "name": "string",
  "gender": "string",
  "birthday": "2025-09-28",
  "birthPlace": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string",
    "generation": "string",
    "createdAt": "2025-09-28"
  }
}
```

---

### 3.6. POST /relations/trees/{treeId}/spouses/{spouseId}
**Mô tả**: Thêm hôn nhân (vợ/chồng)

**Parameters**: 
- `treeId` (path parameter)
- `spouseId` (path parameter)

**Request Body**:
```json
{
  "newSpouse": {
    "name": "string",
    "gender": "string",
    "birthday": "2025-09-28",
    "birthPlace": "string"
  },
  "marriageDate": "2025-09-28",
  "divorceDate": "2025-09-28"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "person1": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "person2": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "gender": "string",
      "birthday": "2025-09-28",
      "birthPlace": "string",
      "generation": "string",
      "createdAt": "2025-09-28"
    },
    "marriageDate": "2025-09-28",
    "divorceDate": "2025-09-28"
  }
}
```

---

## 4. Image Controller

### 4.1. GET /images/{imageId}
**Mô tả**: Lấy ảnh theo imageId

**Parameters**: 
- `imageId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "url": "string",
    "albumId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
```

---

### 4.2. GET /images/by-album/{albumId}
**Mô tả**: Lấy ảnh theo albumId

**Parameters**: 
- `albumId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "name": "string",
      "url": "string",
      "albumId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  ]
}
```

---

### 4.3. POST /images/upload
**Mô tả**: Upload ảnh

**Parameters**: 
- `albumId` (query parameter)

**Request Body**: 
- Content-Type: `multipart/form-data`
- Field: `file` (File/Blob)

**Frontend Implementation**: 
- Hỗ trợ cả base64 string và File object
- Tự động convert base64 → Blob trước khi gửi

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "url": "string",
    "albumId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
}
```

---

### 4.4. DELETE /images/{imageId}
**Mô tả**: Xóa ảnh

**Parameters**: 
- `imageId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": "string"
}
```

---

## 5. Auth Controller

### 5.1. POST /auth/login
**Mô tả**: Đăng nhập

**Parameters**: No parameters

**Request Body**:
```json
{
  "phone": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "token": "string",
    "authenticated": true
  }
}
```

---

### 5.2. POST /auth/register
**Mô tả**: Đăng ký

**Parameters**: No parameters

**Request Body**:
```json
{
  "name": "string",
  "phone": "stringstri",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "name": "string",
    "phone": "stringstri",
    "email": "string",
    "password": "string",
    "confirmPassword": "string"
  }
}
```

---

## 6. Person Controller

### 6.1. GET /persons
**Mô tả**: Lấy thông tin 1 người

**Parameters**: 
- `personId` (query parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "avatarUrl": "string",
    "birthday": "2025-10-21",
    "birthPlace": "string",
    "deathPlace": "string",
    "gravePlace": "string",
    "deathDate": "2025-10-21",
    "generation": "string",
    "createdAt": "2025-10-21"
  }
}
```

---

### 6.2. PUT /persons/{personId}
**Mô tả**: Cập nhật toàn bộ thông tin 1 người

**Parameters**: 
- `personId` (path parameter)

**Request Body**:
```json
{
  "name": "string",
  "gender": "string",
  "birthday": "2025-10-21",
  "birthPlace": "string",
  "createdAt": "2025-10-21"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "avatarUrl": "string",
    "birthday": "2025-10-21",
    "birthPlace": "string",
    "deathPlace": "string",
    "gravePlace": "string",
    "deathDate": "2025-10-21",
    "generation": "string",
    "createdAt": "2025-10-21"
  }
}
```

---

### 6.3. DELETE /persons/{personId}
**Mô tả**: Xoá 1 người

**Parameters**: 
- `personId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": "string"
}
```

---

### 6.4. PATCH /persons/{personId}/death-info
**Mô tả**: Cập nhật thông tin người mất

**Parameters**: 
- `personId` (path parameter)

**Request Body**:
```json
{
  "deathPlace": "string",
  "gravePlace": "string",
  "deathDate": "2025-10-21T06:07:17.576Z"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "avatarUrl": "string",
    "birthday": "2025-10-21",
    "birthPlace": "string",
    "deathPlace": "string",
    "gravePlace": "string",
    "deathDate": "2025-10-21",
    "generation": "string",
    "createdAt": "2025-10-21"
  }
}
```

---

### 6.5. PATCH /persons/{personId}/birth-info
**Mô tả**: Cập nhật thông tin về khai sinh

**Parameters**: 
- `personId` (path parameter)

**Request Body**:
```json
{
  "birthLocation": "string"
}
```

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "avatarUrl": "string",
    "birthday": "2025-10-21",
    "birthPlace": "string",
    "deathPlace": "string",
    "gravePlace": "string",
    "deathDate": "2025-10-21",
    "generation": "string",
    "createdAt": "2025-10-21"
  }
}
```

---

### 6.6. PATCH /persons/{personId}/upload-avatar
**Mô tả**: Thêm hoặc cập nhật avatar

**Parameters**: 
- `personId` (path parameter)

**Request Body**: 
- Content-Type: `multipart/form-data`
- Field: `avatar` (File/Blob)

**Frontend Implementation**: 
- Hỗ trợ cả base64 string và File object
- Tự động convert base64 → Blob trước khi gửi

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "treeId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "string",
    "gender": "string",
    "avatarUrl": "string",
    "birthday": "2025-10-21",
    "birthPlace": "string",
    "deathPlace": "string",
    "gravePlace": "string",
    "deathDate": "2025-10-21",
    "generation": "string",
    "createdAt": "2025-10-21"
  }
}
```

---

## 7. VNPay Controller

### 7.1. POST /vnpay/create-payment
**Mô tả**: Tạo thanh toán

**Parameters**: No parameters

**Request Body**:
```json
{
  "fundId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "amount": 5000000,
  "content": "string"
}
```

**Response**:
```json
{}
```

---

### 7.2. GET /vnpay/{fundId}
**Mô tả**: Lấy danh sách giao dịch của quỹ

**Parameters**: 
- `fundId` (path parameter)

**Response**:
```json
{
  "code": 0,
  "status": "string",
  "message": "string",
  "data": [
    {
      "fundTransactionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "amount": 0,
      "content": "string",
      "createdAt": "2025-10-23T07:25:57.757Z"
    }
  ]
}
```

---

### 7.3. GET /vnpay/payment-callback
**Mô tả**: Xử lý callback từ VNPay

**Parameters**: 
- `params` (query parameters - object with dynamic keys)

**Example Query Params**:
```
?additionalProp1=string&additionalProp2=string&additionalProp3=string
```

**Response**:
```json
{}
```

---

## 📝 Ghi chú

### Response Code
- `code: 0` - Thành công
- `code: 1` hoặc khác - Có lỗi xảy ra

### Date Format
- **Date**: `YYYY-MM-DD` (e.g., `2025-09-28`)
- **DateTime**: `YYYY-MM-DDTHH:mm:ss.sssZ` (ISO 8601 format)

### File Upload
- Các API upload file (image, avatar) sử dụng `multipart/form-data`
- Frontend hỗ trợ cả base64 string và File object

### Authentication
- Hầu hết các API yêu cầu authentication token trong header
- Token được lưu trong localStorage sau khi login thành công
- Header format: `Authorization: Bearer {token}`

---

**Cập nhật lần cuối**: October 24, 2025  
**Version**: 1.0.0

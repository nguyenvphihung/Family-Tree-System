# API Integration Guide - Family Tree System

## 📚 Tổng quan

Tài liệu này hướng dẫn sử dụng các API đã được tích hợp vào hệ thống Family Tree System.

---

## 🌳 Tree Management APIs

### 1. Lấy tất cả cây của người dùng
```typescript
import { familyService } from '@/services';

// GET /trees
const trees = await familyService.getTrees();
```

### 2. Tạo cây mới
```typescript
// POST /trees
const newTree = await familyService.createTree({
  name: "Cây gia phả nhà họ Nguyễn"
});
```

### 3. Cập nhật thông tin cây
```typescript
// PUT /trees/{treeId}
const updatedTree = await familyService.updateTree(treeId, {
  treeId: treeId,
  name: "Tên mới của cây"
});
```

### 4. Xóa cây
```typescript
// DELETE /trees/{treeId}
await familyService.deleteTree(treeId);
```

---

## 🔗 Relations APIs

### 5. Lấy cây (không biết Person)
```typescript
// GET /relations/trees/{treeId}?maxDepth=7
const treeData = await familyService.getTreeRelations(treeId, 7);
```

### 6. Lấy cây từ một Person cụ thể
```typescript
// GET /relations/trees/{treeId}/persons/{personId}?maxDepth=7
const personTreeData = await familyService.getPersonTreeRelations(treeId, personId, 7);
```

### 7. Thêm con cái
```typescript
// POST /relations/trees/{treeId}/children
const childData = await familyService.addChild(treeId, {
  parent1Id: "uuid-parent-1",
  parent2Id: "uuid-parent-2",
  child: {
    name: "Nguyễn Văn An",
    gender: "M",
    birthday: "2025-01-01",
    birthPlace: "Hà Nội"
  },
  childrenType: "BIOLOGICAL",
  adoptionDate: "2025-01-01",
  notes: "Ghi chú"
});
```

### 8. Thêm cha/mẹ
```typescript
// POST /relations/trees/{treeId}/parent
const parentData = await familyService.addParent(treeId, {
  childId: "uuid-child",
  newParent: {
    name: "Nguyễn Văn Cha",
    gender: "M",
    birthday: "1970-01-01",
    birthPlace: "Hà Nội"
  }
});
```

### 9. Tạo người đầu tiên trong cây
```typescript
// POST /relations/trees/{treeId}/root
const rootPerson = await familyService.createRootPerson(treeId, {
  name: "Nguyễn Văn Tổ",
  gender: "M",
  birthday: "1900-01-01",
  birthPlace: "Hà Nội"
});
```

### 10. Thêm vợ/chồng
```typescript
// POST /relations/trees/{treeId}/spouses/{spouseId}
const spouseData = await familyService.addSpouse(treeId, spouseId, {
  newSpouse: {
    name: "Trần Thị Vợ",
    gender: "F",
    birthday: "1975-05-15",
    birthPlace: "Hải Phòng"
  },
  marriageDate: "2000-10-10",
  divorceDate: "2025-01-01" // optional
});
```

---

## 📁 Album Management APIs

### 11. Tìm album bằng ID
```typescript
// GET /albums/{albumId}
const album = await familyService.getAlbumById(albumId);
```

### 12. Lấy tất cả album của người dùng
```typescript
// GET /albums?userId={userId}
const albums = await familyService.getUserAlbums(userId);
```

### 13. Tạo album mới
```typescript
// POST /albums
const newAlbum = await familyService.createAlbum({
  userId: "uuid-user",
  name: "Album gia đình 2025"
});
```

### 14. Cập nhật thông tin album
```typescript
// PUT /albums/{albumId}
const updatedAlbum = await familyService.updateAlbum(albumId, {
  albumId: albumId,
  name: "Tên album mới"
});
```

### 15. Xóa album
```typescript
// DELETE /albums/{albumId}
await familyService.deleteAlbum(albumId);
```

---

## 🖼️ Image Management APIs

### 16. Lấy ảnh theo imageId
```typescript
// GET /images/{imageId}
const image = await familyService.getImage(imageId);
```

### 17. Lấy ảnh theo albumId
```typescript
// GET /images/by-album?albumId={albumId}
const images = await familyService.getImagesByAlbum(albumId);
```

### 18. Upload ảnh
```typescript
// POST /images/upload?name={name}&albumId={albumId}
const uploadedImage = await familyService.uploadImage({
  file: base64String, // Base64 encoded image
  name: "ten-anh.jpg",
  albumId: "uuid-album"
});
```

### 19. Xóa ảnh
```typescript
// DELETE /images/{imageId}
await familyService.deleteImage(imageId);
```

---

## 👤 Person Management APIs

### 20. Lấy thông tin người
```typescript
import { personService } from '@/services';

// GET /persons?personId={personId}
const person = await personService.getPerson(personId);
```

### 21. Cập nhật toàn bộ thông tin người
```typescript
// PUT /persons/{personId}
const updatedPerson = await personService.updatePerson(personId, {
  name: "Nguyễn Văn Updated",
  gender: "M",
  birthday: "1980-05-15",
  birthPlace: "Hà Nội",
  createdAt: "2025-10-21"
});
```

### 22. Xóa người
```typescript
// DELETE /persons/{personId}
await personService.deletePerson(personId);
```

### 23. Cập nhật thông tin người mất
```typescript
// PATCH /persons/{personId}/death-info
const updatedDeathInfo = await personService.updateDeathInfo(personId, {
  deathPlace: "Bệnh viện Bạch Mai",
  gravePlace: "Nghĩa trang Mai Dịch",
  deathDate: "2025-10-21T06:07:17.576Z"
});
```

### 24. Cập nhật thông tin khai sinh
```typescript
// PATCH /persons/{personId}/birth-info
const updatedBirthInfo = await personService.updateBirthInfo(personId, {
  birthLocation: "Bệnh viện Phụ sản Hà Nội"
});
```

### 25. Upload/Cập nhật avatar
```typescript
// PATCH /persons/upload-avatar?personId={personId}
const updatedAvatar = await personService.uploadAvatar(personId, {
  avatar: base64ImageString
});
```

---

## 💳 VNPay Payment APIs

### 26. Tạo thanh toán
```typescript
import { vnpayService } from '@/services';

// POST /vnpay/create-payment
const paymentData = await vnpayService.createPayment(100000); // 100,000 VND
```

### 27. Xử lý callback thanh toán
```typescript
// GET /vnpay/payment-callback
const callbackResult = await vnpayService.handlePaymentCallback({
  additionalProp1: "string",
  additionalProp2: "string",
  additionalProp3: "string"
});
```

---

## 🔐 Authentication APIs

### 28. Đăng nhập
```typescript
import { authService } from '@/services';

// POST /auth/login
const loginResult = await authService.login({
  phone: "0123456789",
  password: "password123"
});
```

### 29. Đăng ký
```typescript
// POST /auth/register
const registerResult = await authService.register({
  name: "Nguyễn Văn A",
  phone: "0123456789",
  email: "nguyenvana@email.com",
  password: "password123",
  confirmPassword: "password123"
});
```

---

## 📝 Response Format

Tất cả các API đều trả về response theo format:

```typescript
{
  code: number,        // Status code
  status: string,      // "success" hoặc "error"
  message: string,     // Thông báo
  data: any           // Dữ liệu trả về
}
```

---

## 🛠️ Error Handling

```typescript
try {
  const result = await familyService.createTree({ name: "New Tree" });
  console.log('Success:', result);
} catch (error: any) {
  console.error('Error:', error.message);
  // Handle error appropriately
}
```

---

## 🎯 Best Practices

1. **Always handle errors** - Wrap API calls in try-catch blocks
2. **Use TypeScript types** - All services have proper type definitions
3. **Check response status** - Verify `code` and `status` fields
4. **Validate input** - Check required fields before making requests
5. **Use environment variables** - Store sensitive data (API keys) in .env files

---

## 📞 Support

For any issues or questions, please contact the development team.

**Last Updated:** October 21, 2025

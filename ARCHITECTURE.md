# 🎯 API Architecture - Family Tree System

## 📂 Cấu trúc tổ chức theo Controller

Hệ thống đã được tái cấu trúc hoàn toàn với nguyên tắc: **Mỗi Controller có 1 file Types và 1 file Service riêng biệt**

---

## 📁 TYPES Structure

```
src/types/
├── auth.ts          → Auth Controller Types (login, register)
├── user.ts          → User Controller Types (profile, settings)
├── person.ts        → Person Controller Types (CRUD person info)
├── tree.ts          → Tree Controller Types (CRUD trees)
├── album.ts         → Album Controller Types (CRUD albums)
├── image.ts         → Image Controller Types (CRUD images)
├── relation.ts      → Relation Controller Types (family relations)
├── vnpay.ts         → VNPay Controller Types (payments)
├── family.ts        → Legacy types (backward compatibility)
└── index.ts         → Export all types
```

### Chi tiết từng file Types:

#### 🔐 **auth.ts** - Auth Controller
- LoginCredentials
- RegisterCredentials
- LoginResponse
- RegisterResponse

#### 👤 **user.ts** - User Controller
- User
- UpdateProfileRequest
- ChangePasswordRequest
- etc.

#### 👨‍👩‍👧‍👦 **person.ts** - Person Controller
- PersonInfo
- GetPersonResponse
- UpdatePersonRequest/Response
- DeletePersonResponse
- UpdateDeathInfoRequest/Response
- UpdateBirthInfoRequest/Response
- UploadAvatarRequest/Response

#### 🌳 **tree.ts** - Tree Controller
- Tree
- CreateTreeRequest/Response
- GetUserTreesResponse
- UpdateTreeRequest/Response
- DeleteTreeResponse

#### 📁 **album.ts** - Album Controller
- Album
- GetAlbumByIdResponse
- GetUserAlbumsResponse
- CreateAlbumRequest/Response
- UpdateAlbumRequest/Response
- DeleteAlbumResponse

#### 🖼️ **image.ts** - Image Controller
- Image
- GetImageResponse
- GetImagesByAlbumResponse
- UploadImageRequest/Response
- DeleteImageResponse

#### 🔗 **relation.ts** - Relation Controller
- PersonBasic
- SpouseInfo
- GetTreeRelationsResponse
- GetPersonTreeRelationsResponse
- AddChildRequest/Response
- AddParentRequest/Response
- CreateRootPersonRequest/Response
- AddSpouseRequest/Response

#### 💳 **vnpay.ts** - VNPay Controller
- CreatePaymentRequest/Response
- PaymentCallbackParams/Response
- VNPayPaymentData
- VNPayResponse
- VNPayConfig

---

## 🔧 SERVICES Structure

```
src/services/
├── authService.ts         → Auth APIs (2 APIs)
├── userService.ts         → User APIs
├── personService.ts       → Person APIs (6 APIs)
├── treeService.ts         → Tree APIs (4 APIs)
├── albumService.ts        → Album APIs (5 APIs)
├── imageService.ts        → Image APIs (4 APIs)
├── relationService.ts     → Relation APIs (6 APIs)
├── vnpayService.ts        → VNPay APIs (2 APIs)
├── familyService.ts       → Legacy (deprecated)
└── index.ts               → Export all services
```

### Chi tiết từng Service:

#### 🔐 **authService.ts** - Authentication
```typescript
✅ login(credentials, rememberMe)
✅ register(credentials)
✅ logout()
✅ getCurrentUser()
✅ Token management
```

#### 🌳 **treeService.ts** - Tree Management (4 APIs)
```typescript
✅ getTrees()                    // GET /trees
✅ getUserTrees(userId)          // GET /trees?userId={userId}
✅ createTree(data)              // POST /trees
✅ updateTree(treeId, data)      // PUT /trees/{treeId}
✅ deleteTree(treeId)            // DELETE /trees/{treeId}
```

#### 📁 **albumService.ts** - Album Management (5 APIs)
```typescript
✅ getAlbumById(albumId)         // GET /albums/{albumId}
✅ getUserAlbums(userId)         // GET /albums?userId={userId}
✅ createAlbum(data)             // POST /albums
✅ updateAlbum(albumId, data)    // PUT /albums/{albumId}
✅ deleteAlbum(albumId)          // DELETE /albums/{albumId}
```

#### 🖼️ **imageService.ts** - Image Management (4 APIs)
```typescript
✅ getImage(imageId)             // GET /images/{imageId}
✅ getImagesByAlbum(albumId)     // GET /images/by-album?albumId={albumId}
✅ uploadImage(data)             // POST /images/upload?name={name}&albumId={albumId}
✅ deleteImage(imageId)          // DELETE /images/{imageId}
```

#### 🔗 **relationService.ts** - Relation Management (6 APIs)
```typescript
✅ getTreeRelations(treeId, maxDepth)                    // GET /relations/trees/{treeId}
✅ getPersonTreeRelations(treeId, personId, maxDepth)    // GET /relations/trees/{treeId}/persons/{personId}
✅ addChild(treeId, data)                                // POST /relations/trees/{treeId}/children
✅ addParent(treeId, data)                               // POST /relations/trees/{treeId}/parent
✅ createRootPerson(treeId, data)                        // POST /relations/trees/{treeId}/root
✅ addSpouse(treeId, spouseId, data)                     // POST /relations/trees/{treeId}/spouses/{spouseId}
```

#### 👨‍👩‍👧‍👦 **personService.ts** - Person Management (6 APIs)
```typescript
✅ getPerson(personId)                   // GET /persons?personId={personId}
✅ updatePerson(personId, data)          // PUT /persons/{personId}
✅ deletePerson(personId)                // DELETE /persons/{personId}
✅ updateDeathInfo(personId, data)       // PATCH /persons/{personId}/death-info
✅ updateBirthInfo(personId, data)       // PATCH /persons/{personId}/birth-info
✅ uploadAvatar(personId, data)          // PATCH /persons/upload-avatar?personId={personId}
```

#### 💳 **vnpayService.ts** - VNPay Payment (2 APIs + helpers)
```typescript
✅ createPayment(amount)                 // POST /vnpay/create-payment
✅ handlePaymentCallback(params)         // GET /vnpay/payment-callback
✅ generatePaymentUrl(paymentData)       // Local helper
✅ verifyPaymentResponse(responseData)   // Local helper
```

---

## 🎯 Cách sử dụng

### Import Services

```typescript
// Import từ index (Recommended)
import { 
  authService, 
  treeService, 
  albumService,
  imageService,
  relationService,
  personService,
  vnpayService 
} from '@/services';

// Hoặc import trực tiếp
import treeService from '@/services/treeService';
import albumService from '@/services/albumService';
```

### Import Types

```typescript
// Import từ index (Recommended)
import { 
  Tree, 
  CreateTreeRequest,
  Album,
  CreateAlbumRequest,
  PersonInfo,
  UpdatePersonRequest
} from '@/types';

// Hoặc import trực tiếp từ controller cụ thể
import { Tree, CreateTreeRequest } from '@/types/tree';
import { Album } from '@/types/album';
```

---

## 📝 Ví dụ sử dụng

### Tree Operations
```typescript
// Lấy tất cả cây
const trees = await treeService.getTrees();

// Tạo cây mới
const newTree = await treeService.createTree({
  name: "Cây gia phả nhà họ Nguyễn"
});

// Cập nhật cây
const updated = await treeService.updateTree(treeId, {
  treeId: treeId,
  name: "Tên mới"
});

// Xóa cây
await treeService.deleteTree(treeId);
```

### Album Operations
```typescript
// Tạo album
const album = await albumService.createAlbum({
  userId: userId,
  name: "Album gia đình 2025"
});

// Lấy albums của user
const albums = await albumService.getUserAlbums(userId);

// Xóa album
await albumService.deleteAlbum(albumId);
```

### Image Operations
```typescript
// Upload ảnh
const image = await imageService.uploadImage({
  file: base64String,
  name: "family-photo.jpg",
  albumId: albumId
});

// Lấy ảnh theo album
const images = await imageService.getImagesByAlbum(albumId);
```

### Relation Operations
```typescript
// Tạo người đầu tiên
const root = await relationService.createRootPerson(treeId, {
  name: "Nguyễn Văn Tổ",
  gender: "M",
  birthday: "1900-01-01",
  birthPlace: "Hà Nội"
});

// Thêm con
const child = await relationService.addChild(treeId, {
  parent1Id: "...",
  parent2Id: "...",
  child: { name: "...", gender: "M", ... },
  childrenType: "BIOLOGICAL",
  adoptionDate: "...",
  notes: "..."
});

// Lấy cây từ một person
const tree = await relationService.getPersonTreeRelations(treeId, personId, 7);
```

### Person Operations
```typescript
// Lấy thông tin người
const person = await personService.getPerson(personId);

// Cập nhật thông tin
const updated = await personService.updatePerson(personId, {
  name: "Tên mới",
  gender: "M",
  birthday: "1980-01-01",
  birthPlace: "Hà Nội",
  createdAt: "..."
});

// Cập nhật thông tin người mất
await personService.updateDeathInfo(personId, {
  deathPlace: "Bệnh viện X",
  gravePlace: "Nghĩa trang Y",
  deathDate: "2025-10-21"
});

// Upload avatar
await personService.uploadAvatar(personId, {
  avatar: base64String
});
```

---

## ✅ Lợi ích của cấu trúc mới

1. **🎯 Tách biệt rõ ràng**: Mỗi controller có file riêng, dễ tìm và maintain
2. **📦 Modularity**: Import chỉ những gì cần, giảm bundle size
3. **🔍 Easy to find**: Biết cần gì thì vào file đó
4. **🛡️ Type Safety**: TypeScript checking đầy đủ
5. **♻️ Reusability**: Types và Services có thể reuse dễ dàng
6. **🧪 Testable**: Dễ dàng viết unit tests cho từng service
7. **📚 Maintainable**: Dễ bảo trì và mở rộng
8. **👥 Team-friendly**: Nhiều người làm cùng lúc không conflict

---

## 🚨 Deprecated

- ❌ `familyService.ts` - **KHÔNG NÊN dùng cho code mới**
  - Vẫn giữ lại để backward compatibility
  - Sử dụng các service chuyên biệt thay thế
  
- ❌ Import từ `types/family.ts` - **KHÔNG NÊN dùng cho code mới**
  - Chỉ giữ `FamilyMember`, `FamilyTree`, `ApiResponse`
  - Sử dụng types từ các controller cụ thể

---

## 📊 Tổng kết

| Controller | APIs | Types File | Service File |
|-----------|------|-----------|--------------|
| Auth | 2 | ✅ auth.ts | ✅ authService.ts |
| Tree | 4 | ✅ tree.ts | ✅ treeService.ts |
| Album | 5 | ✅ album.ts | ✅ albumService.ts |
| Image | 4 | ✅ image.ts | ✅ imageService.ts |
| Relation | 6 | ✅ relation.ts | ✅ relationService.ts |
| Person | 6 | ✅ person.ts | ✅ personService.ts |
| VNPay | 2 | ✅ vnpay.ts | ✅ vnpayService.ts |
| User | N/A | ✅ user.ts | ✅ userService.ts |
| **TOTAL** | **29** | **8 files** | **8 files** |

---

**🎉 Cấu trúc đã hoàn thiện 100%!**

*Last Updated: October 21, 2025*

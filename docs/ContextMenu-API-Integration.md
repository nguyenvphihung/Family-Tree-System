# ContextMenu - API Integration Documentation

## Tổng quan

ContextMenu đã được cập nhật để tích hợp đầy đủ với các API của person-controller, cung cấp khả năng quản lý thông tin người trong cây gia phả một cách toàn diện.

## Các tính năng chính

### 1. Quản lý thông tin cơ bản
- **Xem thông tin chi tiết**: Fetch thông tin đầy đủ từ API `GET /persons`
- **Chỉnh sửa thông tin**: Sử dụng modal EditPersonModal với API `PUT /persons/{personId}`
- **Xóa người**: API `DELETE /persons/{personId}` với xác nhận

### 2. Cập nhật thông tin chuyên biệt
- **Ảnh đại diện**: API `PATCH /persons/upload-avatar`
- **Thông tin khai sinh**: API `PATCH /persons/{personId}/birth-info`
- **Thông tin người mất**: API `PATCH /persons/{personId}/death-info`

### 3. Quản lý quan hệ
- **Thêm con**: Chuyển hướng đến AddChildModal
- **Thêm cha/mẹ**: Chuyển hướng đến AddParentModal  
- **Thêm vợ/chồng**: Chuyển hướng đến AddSpouseModal

## Cấu trúc API calls

### 1. GET Person Details
```typescript
const handleViewInfoWithAPI = async () => {
  const details = await personService.getPerson(selectedPerson.id);
  // Hiển thị thông tin chi tiết
};
```

### 2. Update Person
```typescript
const handleUpdatePersonInfo = async (updateData: UpdatePersonRequest) => {
  const updatedPerson = await personService.updatePerson(personId, updateData);
  // Cập nhật UI và refresh tree
};
```

### 3. Upload Avatar
```typescript
const handleUploadAvatar = async (avatarBase64: string) => {
  const updatedPerson = await personService.uploadAvatar(personId, { avatar: avatarBase64 });
  // Cập nhật avatar trong UI
};
```

### 4. Update Death Info
```typescript
const handleUpdateDeathInfo = async (deathPlace, gravePlace, deathDate) => {
  const updatedPerson = await personService.updateDeathInfo(personId, {
    deathPlace, gravePlace, deathDate
  });
};
```

### 5. Update Birth Info
```typescript
const handleUpdateBirthInfo = async (birthLocation: string) => {
  const updatedPerson = await personService.updateBirthInfo(personId, { birthLocation });
};
```

### 6. Delete Person
```typescript
const handleDeleteWithAPI = async () => {
  await personService.deletePerson(personId);
  // Refresh tree và hiển thị thông báo
};
```

## EditPersonModal

Modal chỉnh sửa toàn diện với các section:

### 1. Ảnh đại diện
- Upload file ảnh
- Preview trước khi upload
- Chuyển đổi base64 tự động

### 2. Thông tin cơ bản
- Họ tên, giới tính, ngày sinh, nơi sinh
- Validation input

### 3. Thông tin nơi sinh chi tiết
- Cập nhật nơi sinh chi tiết
- API call riêng biệt

### 4. Thông tin người mất
- Nơi mất, nơi an táng, ngày mất
- Form đầy đủ với validation

## Props Interface

```typescript
interface ContextMenuProps {
  isVisible: boolean;
  x: number;
  y: number;
  selectedPerson?: FamilyMember | null;
  onAddChild: () => void;
  onAddParent: () => void;
  onAddSpouse: () => void;
  onViewInfo: () => void;
  onDelete: () => void;
  onClose: () => void;
  onRefresh?: () => void;
  onEditPerson?: (person: PersonInfo) => void;
  onPersonUpdated?: (updatedPerson: PersonInfo) => void;
}
```

## Loading States

- `isLoading`: Trạng thái loading chung cho các API calls
- `isDeleting`: Trạng thái loading riêng cho delete operation
- Loading spinners cho từng action button

## Error Handling

- Try-catch cho tất cả API calls
- Toast notifications cho success/error
- Fallback cho trường hợp API fail
- Detailed error messages

## Usage Example

```typescript
<ContextMenu
  isVisible={showContextMenu}
  x={contextMenuPosition.x}
  y={contextMenuPosition.y}
  selectedPerson={selectedPerson}
  onAddChild={() => setShowAddChildModal(true)}
  onAddParent={() => setShowAddParentModal(true)}
  onAddSpouse={() => setShowAddSpouseModal(true)}
  onViewInfo={() => setShowPersonInfoModal(true)}
  onDelete={() => handleDeleteFromTree()}
  onClose={() => setShowContextMenu(false)}
  onRefresh={refreshFamilyTree}
  onPersonUpdated={handlePersonUpdated}
/>
```

## Best Practices

1. **Error Handling**: Luôn có fallback cho API failures
2. **Loading States**: Hiển thị loading indicators cho UX tốt hơn
3. **Optimistic Updates**: Cập nhật UI ngay lập tức sau khi API success
4. **Refresh Strategy**: Refresh data sau các operations quan trọng
5. **Validation**: Validate input trước khi gọi API
6. **Toast Notifications**: Thông báo rõ ràng cho user về kết quả

## Dependencies

- personService: Service để gọi API
- toast: UI notification system
- React hooks: useState cho state management
- UI components: Dialog, Button, Input, Select, etc.

## Lưu ý

1. Component yêu cầu `selectedPerson` có `id` để thực hiện API calls
2. Tất cả API calls đều async và có error handling
3. Modal EditPersonModal được lazy load khi cần thiết
4. File upload được convert sang base64 trước khi gửi API
5. Prompt đơn giản có thể được thay thế bằng modal riêng biệt để UX tốt hơn
# VNPay Payment Integration

## Tổng quan
Module VNPay Payment cung cấp giao diện để tích hợp thanh toán qua VNPay cho hệ thống Family Tree.

## Cấu trúc

```
src/pages/VNPay/
├── index.tsx              # Trang chính - Tạo thanh toán & xem giao dịch
├── PaymentCallback.tsx    # Trang xử lý callback từ VNPay
└── README.md             # Tài liệu này
```

## Tính năng

### 1. Tạo thanh toán mới
- Form nhập thông tin thanh toán
- Validate dữ liệu đầu vào
- Chuyển hướng đến trang thanh toán VNPay
- Hỗ trợ:
  - Fund ID (UUID format)
  - Số tiền (tối thiểu 5,000 VNĐ)
  - Nội dung thanh toán

### 2. Xem lịch sử giao dịch
- Tra cứu giao dịch theo Fund ID
- Hiển thị danh sách giao dịch dạng bảng
- Thông tin chi tiết:
  - ID giao dịch
  - Số tiền
  - Nội dung
  - Thời gian tạo

### 3. Xử lý Payment Callback
- Trang riêng để xử lý kết quả từ VNPay
- Hiển thị trạng thái thanh toán
- Thông tin chi tiết giao dịch

### 4. Dashboard Statistics
- Tổng số giao dịch
- Tổng giá trị giao dịch
- Trạng thái hệ thống

## API Endpoints

### POST /vnpay/create-payment
Tạo yêu cầu thanh toán mới

**Request Body:**
```json
{
  "fundId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "amount": 5000000,
  "content": "Thanh toán cho..."
}
```

**Response:**
```json
{
  "code": 0,
  "status": "success",
  "message": "string",
  "data": {
    "paymentUrl": "https://...",
    "orderId": "..."
  }
}
```

### GET /vnpay/{fundId}
Lấy danh sách giao dịch của một quỹ

**Parameters:**
- `fundId` (path) - UUID của quỹ

**Response:**
```json
{
  "code": 0,
  "status": "success",
  "message": "string",
  "data": [
    {
      "fundTransactionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "amount": 5000000,
      "content": "Thanh toán cho...",
      "createdAt": "2025-10-23T07:25:57.757Z"
    }
  ]
}
```

### GET /vnpay/payment-callback
Xử lý callback từ VNPay sau khi thanh toán

**Parameters:**
- Query params từ VNPay (vnp_ResponseCode, vnp_TxnRef, vnp_Amount, etc.)

**Response:**
```json
{
  "code": 0,
  "status": "success",
  "message": "Payment processed successfully"
}
```

## Routes

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/vnpay` | `VNPayPage` | Trang chính - tạo thanh toán và xem giao dịch |
| `/vnpay/callback` | `PaymentCallback` | Xử lý callback từ VNPay |

## Services

### vnpayService

```typescript
import { vnpayService } from '@/services';

// Tạo thanh toán
const payment = await vnpayService.createPayment({
  fundId: 'uuid-here',
  amount: 5000000,
  content: 'Payment description'
});

// Lấy giao dịch
const transactions = await vnpayService.getFundTransactions('fund-uuid');

// Xử lý callback
const result = await vnpayService.handlePaymentCallback(params);
```

## Types

### CreatePaymentRequest
```typescript
interface CreatePaymentRequest {
  fundId: string;
  amount: number;
  content: string;
}
```

### FundTransaction
```typescript
interface FundTransaction {
  fundTransactionId: string;
  amount: number;
  content: string;
  createdAt: string;
}
```

### GetFundTransactionsResponse
```typescript
interface GetFundTransactionsResponse {
  code: number;
  status: string;
  message: string;
  data: FundTransaction[];
}
```

## Sử dụng

### 1. Truy cập trang VNPay
```
http://localhost:5173/vnpay
```

### 2. Tạo thanh toán
1. Chọn tab "Tạo thanh toán"
2. Nhập Fund ID (UUID format)
3. Nhập số tiền (≥ 5,000 VNĐ)
4. Nhập nội dung thanh toán
5. Nhấn "Tạo thanh toán"
6. Bạn sẽ được chuyển đến trang VNPay để thanh toán

### 3. Xem lịch sử giao dịch
1. Chọn tab "Lịch sử giao dịch"
2. Nhập Fund ID
3. Nhấn "Tìm kiếm"
4. Xem danh sách giao dịch

### 4. Sau khi thanh toán
- VNPay sẽ redirect về `/vnpay/callback` với kết quả
- Trang callback hiển thị trạng thái thanh toán
- Bạn có thể quay lại trang VNPay hoặc về Dashboard

## UI Components

### Tabs
- Tab 1: Tạo thanh toán mới
- Tab 2: Lịch sử giao dịch

### Cards
- Form tạo thanh toán
- Bảng danh sách giao dịch
- Thống kê tổng quan

### Loading States
- Loading khi tạo thanh toán
- Loading khi tải giao dịch
- Loading khi xử lý callback

### Toast Notifications
- Thành công/Thất bại khi tạo thanh toán
- Thành công/Thất bại khi tải giao dịch
- Thành công/Thất bại khi xử lý callback

## Error Handling

### Validation Errors
- Fund ID bắt buộc
- Số tiền phải ≥ 5,000 VNĐ
- Nội dung bắt buộc

### API Errors
- Network errors
- Server errors (500)
- Validation errors (400)
- Not found errors (404)

Tất cả errors đều hiển thị toast notification với mô tả chi tiết.

## Testing

### Test Cases
1. ✅ Tạo thanh toán với dữ liệu hợp lệ
2. ✅ Validate form với dữ liệu thiếu
3. ✅ Validate số tiền < 5,000 VNĐ
4. ✅ Tải giao dịch với Fund ID hợp lệ
5. ✅ Tải giao dịch với Fund ID không tồn tại
6. ✅ Xử lý callback thành công
7. ✅ Xử lý callback thất bại

## Roadmap

### Future Enhancements
- [ ] Lọc giao dịch theo ngày
- [ ] Export danh sách giao dịch (CSV/Excel)
- [ ] Biểu đồ thống kê giao dịch
- [ ] Tích hợp nhiều payment gateway
- [ ] Lưu lịch sử thanh toán local
- [ ] Notification realtime khi có giao dịch mới

## Lưu ý

1. **Fund ID**: Phải là UUID hợp lệ (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
2. **Amount**: 
   - Tối thiểu 5,000 VNĐ
   - VNPay nhân số tiền với 100 (5000000 → 500000000)
3. **Callback URL**: Backend cần cấu hình return URL về `/vnpay/callback`
4. **Security**: VNPay sử dụng hash để verify callback params

## Support

Nếu có vấn đề, vui lòng tạo issue trên GitHub hoặc liên hệ team development.

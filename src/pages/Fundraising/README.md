# Hướng dẫn cấu hình VNPay Sandbox cho chức năng Góp Quỹ

## Tổng quan
Chức năng "Góp Quỹ" sử dụng VNPay Sandbox để xử lý thanh toán ảo. Đây là môi trường thử nghiệm hoàn toàn an toàn, không có giao dịch thực tế.

## Cấu hình VNPay Sandbox

### 1. Đăng ký tài khoản VNPay Sandbox
1. Truy cập: https://sandbox.vnpayment.vn/
2. Đăng ký tài khoản sandbox
3. Nhận thông tin:
   - TMN Code (Terminal Code)
   - Secret Key (Khóa bí mật)

### 2. Cập nhật cấu hình
Mở file `src/services/vnpayService.ts` và cập nhật:

```typescript
const VNPAY_CONFIG = {
  // Thay thế bằng TMN Code thực tế từ VNPay
  TMN_CODE: 'YOUR_ACTUAL_TMN_CODE',
  
  // Thay thế bằng Secret Key thực tế từ VNPay
  SECRET_KEY: 'YOUR_ACTUAL_SECRET_KEY',
  
  // Các cấu hình khác giữ nguyên
  PAYMENT_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  RETURN_URL: `${window.location.origin}/fundraising/payment-result`,
  CURRENCY: 'VND',
  LOCALE: 'vn',
  VERSION: '2.1.0'
};
```

### 3. Thông tin thẻ test
VNPay cung cấp các thẻ test để thanh toán:

**Thẻ ATM nội địa:**
- Số thẻ: 9704198526191432198
- Tên chủ thẻ: NGUYEN VAN A
- Ngày phát hành: 07/15
- Mã OTP: 123456

**Thẻ Visa:**
- Số thẻ: 4531234567890123
- Tên chủ thẻ: NGUYEN VAN A
- Ngày phát hành: 07/15
- Mã OTP: 123456

## Quy trình thanh toán

### 1. Người dùng góp quỹ
1. Truy cập `/fundraising`
2. Nhập số tiền (tối thiểu 10,000 VND)
3. Nhấn "Thanh toán VNPay"
4. Chuyển hướng đến VNPay Sandbox

### 2. Thanh toán trên VNPay
1. Chọn phương thức thanh toán
2. Nhập thông tin thẻ test
3. Xác nhận thanh toán
4. VNPay xử lý và gọi lại website

### 3. Xử lý kết quả
1. VNPay chuyển hướng về `/fundraising/payment-result`
2. Website xác thực chữ ký số
3. Cập nhật trạng thái quỹ
4. Hiển thị kết quả cho người dùng

## Bảo mật

### 1. Xác thực chữ ký số
VNPay sử dụng HMAC SHA512 để tạo chữ ký số. Trong production, cần:
- Sử dụng thư viện crypto-js hoặc Web Crypto API
- Bảo mật Secret Key
- Xác thực tất cả callback từ VNPay

### 2. Xử lý callback
```typescript
// Xác thực callback từ VNPay
const isValid = vnpayService.verifyPaymentResponse(responseData);
if (isValid) {
  // Cập nhật database
  // Gửi email xác nhận
  // Cập nhật UI
}
```

## Lưu ý quan trọng

1. **Môi trường Sandbox**: Tất cả giao dịch đều là ảo
2. **Không có tiền thật**: Không có giao dịch thực tế nào được thực hiện
3. **Chỉ để demo**: Chức năng này chỉ dành cho mục đích trình diễn
4. **Cấu hình production**: Cần thay đổi URL và credentials cho môi trường thực tế

## Troubleshooting

### Lỗi thường gặp:
1. **"Invalid TMN Code"**: Kiểm tra TMN_CODE trong config
2. **"Invalid signature"**: Kiểm tra SECRET_KEY và thuật toán hash
3. **"Amount too small"**: Số tiền tối thiểu là 10,000 VND
4. **"Invalid return URL"**: Kiểm tra RETURN_URL có đúng domain không

### Debug:
- Mở Developer Tools (F12)
- Xem Console để kiểm tra lỗi
- Kiểm tra Network tab để xem request/response

import { API_ENDPOINTS } from '../config/apiEndpoints';
import { makeRequest } from '../utils';
import {
  CreatePaymentRequest,
  PaymentCallbackParams,
  VNPayPaymentData,
  VNPayResponse,
  VNPayConfig,
} from '../types/vnpay';

// VNPay Sandbox Configuration
const VNPAY_CONFIG: VNPayConfig = {
  // Sandbox URLs
  PAYMENT_URL: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
  RETURN_URL: `${window.location.origin}/fundraising/payment-result`,

  // Sandbox credentials (these should be moved to environment variables in production)
  TMN_CODE: 'YOUR_TMN_CODE', // Replace with actual TMN code from VNPay
  SECRET_KEY: 'YOUR_SECRET_KEY', // Replace with actual secret key from VNPay

  // Currency and locale
  CURRENCY: 'VND',
  LOCALE: 'vn',

  // Version
  VERSION: '2.1.0'
};

class VNPayService {
  // ==================== API METHODS ====================

  /**
   * POST /vnpay/create-payment - Tạo thanh toán
   */
  async createPayment(amount: number): Promise<any> {
    try {
      const data: CreatePaymentRequest = { amount };
      const result = await makeRequest(
        API_ENDPOINTS.VNPAY.CREATE_PAYMENT,
        'POST',
        data,
        'response-area'
      );
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data || result.data;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * GET /vnpay/payment-callback - Callback thanh toán
   */
  async handlePaymentCallback(params: PaymentCallbackParams): Promise<any> {
    try {
      const result = await makeRequest(
        API_ENDPOINTS.VNPAY.PAYMENT_CALLBACK,
        'GET',
        null,
        null,
        params
      );
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result.data.data || result.data;
    } catch (error: any) {
      throw error;
    }
  }

  // ==================== LOCAL HELPER METHODS ====================
  /**
   * Generate VNPay payment URL
   */
  generatePaymentUrl(paymentData: VNPayPaymentData): VNPayResponse {
    try {
      const {
        amount,
        orderId,
        orderDescription,
        returnUrl = VNPAY_CONFIG.RETURN_URL,
        ipAddress = '127.0.0.1'
      } = paymentData;

      // Validate input
      if (!amount || amount < 10000) {
        return {
          success: false,
          error: 'Số tiền tối thiểu là 10,000 VND'
        };
      }

      if (!orderId) {
        return {
          success: false,
          error: 'Mã đơn hàng không được để trống'
        };
      }

      // Create payment parameters
      const vnpParams: Record<string, string> = {
        vnp_Version: VNPAY_CONFIG.VERSION,
        vnp_Command: 'pay',
        vnp_TmnCode: VNPAY_CONFIG.TMN_CODE,
        vnp_Amount: (amount * 100).toString(), // VNPay expects amount in cents
        vnp_CurrCode: VNPAY_CONFIG.CURRENCY,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderDescription,
        vnp_OrderType: 'other',
        vnp_Locale: VNPAY_CONFIG.LOCALE,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddress,
        vnp_CreateDate: new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, ''),
      };

      // Sort parameters and create query string
      const sortedParams = this.sortObject(vnpParams);
      const queryString = this.createQueryString(sortedParams);

      // Create secure hash
      const secureHash = this.createSecureHash(queryString);

      // Add secure hash to parameters
      const finalParams = {
        ...sortedParams,
        vnp_SecureHash: secureHash
      };

      // Create final payment URL
      const paymentUrl = `${VNPAY_CONFIG.PAYMENT_URL}?${this.createQueryString(finalParams)}`;

      return {
        success: true,
        paymentUrl
      };

    } catch (error) {
      console.error('VNPay payment URL generation error:', error);
      return {
        success: false,
        error: 'Có lỗi xảy ra khi tạo URL thanh toán'
      };
    }
  }

  /**
   * Verify VNPay callback response
   */
  verifyPaymentResponse(responseData: Record<string, string>): boolean {
    try {
      const { vnp_SecureHash, ...otherParams } = responseData;

      if (!vnp_SecureHash) {
        return false;
      }

      // Sort parameters and create query string
      const sortedParams = this.sortObject(otherParams);
      const queryString = this.createQueryString(sortedParams);

      // Create secure hash
      const expectedHash = this.createSecureHash(queryString);

      // Compare hashes
      return vnp_SecureHash === expectedHash;
    } catch (error) {
      console.error('VNPay response verification error:', error);
      return false;
    }
  }

  /**
   * Sort object by keys
   */
  private sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = obj[key];
    });
    return sorted;
  }

  /**
   * Create query string from object
   */
  private createQueryString(params: Record<string, string>): string {
    return Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  /**
   * Create secure hash using HMAC SHA512
   */
  private createSecureHash(queryString: string): string {
    // In a real implementation, you would use a proper HMAC SHA512 library
    // For now, we'll create a simple hash for demonstration
    // In production, use: crypto.subtle.importKey() and crypto.subtle.sign() for browser

    // This is a simplified version for demo purposes
    // In real implementation, use Web Crypto API or a library like crypto-js
    const encoder = new TextEncoder();
    const data = encoder.encode(queryString + VNPAY_CONFIG.SECRET_KEY);

    // Simple hash for demo (not secure for production)
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data[i];
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  /**
   * Generate order ID
   */
  generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER_${timestamp}_${random}`;
  }

  /**
   * Format amount for display
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  }
}

export const vnpayService = new VNPayService();
export default vnpayService;


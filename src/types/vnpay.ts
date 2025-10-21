// VNPay payment interfaces for API requests and responses

// ==================== CREATE PAYMENT ====================
export interface CreatePaymentRequest {
    amount: number;
}

export interface CreatePaymentResponse {
    code: number;
    status: string;
    message: string;
    data: any; // Payment URL or payment data from backend
}

// ==================== PAYMENT CALLBACK ====================
export interface PaymentCallbackParams {
    [key: string]: string;
}

export interface PaymentCallbackResponse {
    code: number;
    status: string;
    message: string;
    data: any;
}

// ==================== LOCAL PAYMENT DATA ====================
export interface VNPayPaymentData {
    amount: number;
    orderId: string;
    orderDescription: string;
    returnUrl?: string;
    ipAddress?: string;
}

export interface VNPayResponse {
    success: boolean;
    paymentUrl?: string;
    error?: string;
}

// ==================== VNPAY CONFIGURATION ====================
export interface VNPayConfig {
    PAYMENT_URL: string;
    RETURN_URL: string;
    TMN_CODE: string;
    SECRET_KEY: string;
    CURRENCY: string;
    LOCALE: string;
    VERSION: string;
}

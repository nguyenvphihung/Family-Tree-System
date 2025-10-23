// VNPay Types

// Request body for creating payment
export interface CreatePaymentRequest {
    fundId: string;
    amount: number;
    content: string;
}

// Response for create payment
export interface CreatePaymentResponse {
    code?: number;
    status?: string;
    message?: string;
    data?: {
        paymentUrl?: string;
        orderId?: string;
        [key: string]: any;
    };
}

// Fund transaction data
export interface FundTransaction {
    fundTransactionId: string;
    amount: number;
    content: string;
    createdAt: string;
}

// Response for getting fund transactions
export interface GetFundTransactionsResponse {
    code: number;
    status: string;
    message: string;
    data: FundTransaction[];
}

// Payment callback params
export interface PaymentCallbackParams {
    [key: string]: string;
}

// Payment callback response
export interface PaymentCallbackResponse {
    code?: number;
    status?: string;
    message?: string;
    data?: any;
}

// VNPay payment status
export enum PaymentStatus {
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
    PENDING = 'PENDING',
}

// Fund info for display
export interface FundInfo {
    fundId: string;
    fundName: string;
    description?: string;
    currentBalance?: number;
}

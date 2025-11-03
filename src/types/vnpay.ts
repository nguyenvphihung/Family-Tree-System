// VNPay types

export type CreatePaymentRequest = {
    fundId: string;
    amount: number;
    content: string;
};

export type CreatePaymentResponse = {
    code?: number;
    status?: string;
    message?: string;

    paymentUrl?: string;
    data?: {
        paymentUrl?: string;
        [key: string]: any;
    } | null;
};

export type FundTransaction = {
    fundTransactionId: string;
    amount: number;
    content: string;
    createdAt: string; // ISO string
};

export type GetFundTransactionsResponse = {
    code: number;
    status: string;
    message: string;
    data: FundTransaction[];
};

export type VnpayCallbackParams = Record<string, string>;

export type PaymentCallbackResponse = {
    code?: number;
    status?: string;
    message?: string;
    data?: any;
};



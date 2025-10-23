import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/config/apiEndpoints';
import type {
    CreatePaymentRequest,
    CreatePaymentResponse,
    GetFundTransactionsResponse,
    PaymentCallbackParams,
    PaymentCallbackResponse,
} from '@/types/vnpay';

/**
 * VNPay Service
 * Handles all VNPay related API calls
 */
const vnpayService = {
    /**
     * Create a new payment
     * POST /vnpay/create-payment
     */
    createPayment: async (
        paymentData: CreatePaymentRequest
    ): Promise<CreatePaymentResponse> => {
        try {
            const response = await axiosInstance.post<CreatePaymentResponse>(
                API_ENDPOINTS.VNPAY.CREATE_PAYMENT,
                paymentData
            );
            return response.data;
        } catch (error: any) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    /**
     * Get fund transactions by fundId
     * GET /vnpay/{fundId}
     */
    getFundTransactions: async (
        fundId: string
    ): Promise<GetFundTransactionsResponse> => {
        try {
            const response = await axiosInstance.get<GetFundTransactionsResponse>(
                API_ENDPOINTS.VNPAY.GET_FUND_TRANSACTIONS(fundId)
            );
            return response.data;
        } catch (error: any) {
            console.error('Error getting fund transactions:', error);
            throw error;
        }
    },

    /**
     * Handle payment callback from VNPay
     * GET /vnpay/payment-callback
     */
    handlePaymentCallback: async (
        params: PaymentCallbackParams
    ): Promise<PaymentCallbackResponse> => {
        try {
            const response = await axiosInstance.get<PaymentCallbackResponse>(
                API_ENDPOINTS.VNPAY.PAYMENT_CALLBACK,
                { params }
            );
            return response.data;
        } catch (error: any) {
            console.error('Error handling payment callback:', error);
            throw error;
        }
    },
};

export default vnpayService;

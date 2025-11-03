import { API_ENDPOINTS } from '@/config/apiEndpoints';
import { makeRequest } from '@/components/utils';
import type {
    CreatePaymentRequest,
    CreatePaymentResponse,
    GetFundTransactionsResponse,
    FundTransaction,
    VnpayCallbackParams,
    PaymentCallbackResponse,
} from '@/types/vnpay';

class VNPayService {
    // POST /vnpay/create-payment
    async createPayment(payload: CreatePaymentRequest): Promise<{ data: CreatePaymentResponse }> {
        const result = await makeRequest(API_ENDPOINTS.VNPAY.CREATE_PAYMENT, 'POST', payload, null);
        if ((result as any).error) {
            throw new Error((result as any).error.message || 'Không thể tạo thanh toán');
        }
        const envelope = (result as { data: CreatePaymentResponse }).data;
        const normalized: CreatePaymentResponse = {
            ...envelope,
            paymentUrl: envelope?.paymentUrl || envelope?.data?.paymentUrl,
        };
        return { data: normalized };
    }

    // GET /vnpay/{fundId}
    async getFundTransactions(fundId: string): Promise<{ data: FundTransaction[] }> {
        const result = await makeRequest(API_ENDPOINTS.VNPAY.GET_FUND_TRANSACTIONS(fundId), 'GET', null, null);
        if ((result as any).error) {
            throw new Error((result as any).error.message || 'Không thể tải danh sách giao dịch');
        }
        // Server có dạng envelope { code, status, message, data: FundTransaction[] }
        const envelope = (result as { data: GetFundTransactionsResponse }).data;
        return { data: envelope?.data || [] };
    }

    // GET /vnpay/payment-callback?{params}
    async handlePaymentCallback(params: VnpayCallbackParams): Promise<{ data: PaymentCallbackResponse }> {
        const result = await makeRequest(API_ENDPOINTS.VNPAY.PAYMENT_CALLBACK, 'GET', null, null, params);
        if ((result as any).error) {
            throw new Error((result as any).error.message || 'Không thể xử lý callback');
        }
        return result as { data: PaymentCallbackResponse };
    }
}

export const vnpayService = new VNPayService();
export default vnpayService;



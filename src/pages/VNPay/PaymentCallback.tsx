import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { vnpayService } from '@/services';

const PaymentCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Đang xử lý kết quả thanh toán...');

    useEffect(() => {
        const handleCallback = async () => {
            const params = Object.fromEntries(searchParams.entries());

            if (Object.keys(params).length === 0) {
                setStatus('error');
                setMessage('Không có thông tin thanh toán');
                return;
            }

            try {
                const response = await vnpayService.handlePaymentCallback(params);

                if (params.vnp_ResponseCode === '00') {
                    setStatus('success');
                    setMessage('Thanh toán thành công! Giao dịch của bạn đã được xử lý.');
                } else {
                    setStatus('error');
                    setMessage(`Thanh toán thất bại! Mã lỗi: ${params.vnp_ResponseCode}`);
                }
            } catch (error: any) {
                console.error('Payment callback error:', error);
                setStatus('error');
                setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi xử lý thanh toán');
            }
        };

        handleCallback();
    }, [searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === 'loading' && (
                            <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                        )}
                        {status === 'success' && (
                            <CheckCircle2 className="h-16 w-16 text-green-500" />
                        )}
                        {status === 'error' && (
                            <XCircle className="h-16 w-16 text-red-500" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {status === 'loading' && 'Đang xử lý'}
                        {status === 'success' && 'Thanh toán thành công'}
                        {status === 'error' && 'Thanh toán thất bại'}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        {message}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status !== 'loading' && (
                        <>
                            {searchParams.get('vnp_TxnRef') && (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Mã giao dịch</p>
                                    <p className="font-mono font-semibold">{searchParams.get('vnp_TxnRef')}</p>
                                </div>
                            )}

                            {searchParams.get('vnp_Amount') && (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Số tiền</p>
                                    <p className="font-semibold">
                                        {new Intl.NumberFormat('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        }).format(parseInt(searchParams.get('vnp_Amount') || '0') / 100)}
                                    </p>
                                </div>
                            )}

                            {searchParams.get('vnp_PayDate') && (
                                <div className="bg-muted p-3 rounded-lg">
                                    <p className="text-sm text-muted-foreground">Thời gian thanh toán</p>
                                    <p className="font-semibold">
                                        {formatPayDate(searchParams.get('vnp_PayDate') || '')}
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={() => navigate('/vnpay')}
                                    className="flex-1"
                                    variant={status === 'success' ? 'default' : 'outline'}
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Quay lại
                                </Button>
                                {status === 'success' && (
                                    <Button
                                        onClick={() => navigate('/dashboard')}
                                        className="flex-1"
                                    >
                                        Về trang chủ
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Format payment date from VNPay (YYYYMMDDHHmmss)
const formatPayDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 14) return dateStr;

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
};

export default PaymentCallback;

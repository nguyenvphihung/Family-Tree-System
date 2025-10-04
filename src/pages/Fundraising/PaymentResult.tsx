import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Shield
} from 'lucide-react';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get payment data from URL parameters
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const transactionId = searchParams.get('vnp_TxnRef') || 'TXN' + Date.now();
    const responseCode = searchParams.get('vnp_ResponseCode') || '00';

    setPaymentData({
      amount: amount ? parseInt(amount) : 0,
      status: status || 'success',
      transactionId,
      responseCode,
      timestamp: new Date().toLocaleString('vi-VN'),
      bankCode: searchParams.get('vnp_BankCode') || 'NCB',
      cardType: searchParams.get('vnp_CardType') || 'ATM'
    });
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const isSuccess = paymentData?.status === 'success' && paymentData?.responseCode === '00';

  const handleBackToFundraising = () => {
    navigate('/fundraising');
  };

  const handleViewHistory = () => {
    // In real implementation, this would navigate to payment history
    console.log('View payment history');
  };

  if (!paymentData) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Kết quả thanh toán</h1>
          <p className="text-gray-600">Thông tin chi tiết về giao dịch của bạn</p>
        </div>

        {/* Status Alert */}
        <Alert className={isSuccess ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          {isSuccess ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={isSuccess ? "text-green-800" : "text-red-800"}>
            {isSuccess 
              ? "Thanh toán thành công! Số tiền đã được cộng vào quỹ chung gia đình." 
              : "Thanh toán thất bại. Vui lòng thử lại hoặc liên hệ hỗ trợ."
            }
          </AlertDescription>
        </Alert>

        {/* Payment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Chi tiết giao dịch
            </CardTitle>
            <CardDescription>
              Thông tin chi tiết về giao dịch góp quỹ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Mã giao dịch:</span>
                  <span className="text-sm font-mono">{paymentData.transactionId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(paymentData.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <span className={`text-sm font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {isSuccess ? 'Thành công' : 'Thất bại'}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Thời gian:</span>
                  <span className="text-sm">{paymentData.timestamp}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Ngân hàng:</span>
                  <span className="text-sm">{paymentData.bankCode}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Loại thẻ:</span>
                  <span className="text-sm">{paymentData.cardType}</span>
                </div>
              </div>
            </div>

            {isSuccess && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Giao dịch đã được xác thực</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Số tiền {formatCurrency(paymentData.amount)} đã được cộng vào quỹ chung gia đình.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fund Update Card */}
        {isSuccess && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cập nhật quỹ chung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Số tiền góp:</span>
                  <span className="text-lg font-bold text-green-600">
                    +{formatCurrency(paymentData.amount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tổng quỹ hiện tại:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(15000000 + paymentData.amount)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Cập nhật lúc {paymentData.timestamp}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleBackToFundraising}
            className="flex-1"
            variant="outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại trang góp quỹ
          </Button>
          
          {isSuccess && (
            <Button 
              onClick={handleViewHistory}
              className="flex-1"
            >
              Xem lịch sử góp quỹ
            </Button>
          )}
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thông tin bổ sung</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-gray-600 space-y-2">
            <p>
              • Giao dịch được xử lý thông qua VNPay Sandbox (môi trường thử nghiệm)
            </p>
            <p>
              • Tất cả số tiền và thông tin thanh toán đều là giả lập
            </p>
            <p>
              • Không có giao dịch thực tế nào được thực hiện
            </p>
            <p>
              • Để hỗ trợ, vui lòng liên hệ: support@familytree.com
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentResult;


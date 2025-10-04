import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { mockDataService } from '../../services/mockDataService';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Calendar,
  Shield,
  Heart,
  Sparkles,
  Gift,
  TrendingUp
} from 'lucide-react';

const PaymentResult: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Get payment data from URL parameters or use mock data
    const amount = searchParams.get('amount');
    const status = searchParams.get('status');
    const transactionId = searchParams.get('vnp_TxnRef') || `TXN_${Date.now()}`;
    const responseCode = searchParams.get('vnp_ResponseCode') || '00';

    // Mock payment data for demo
    setPaymentData({
      amount: amount ? parseInt(amount) : 500000, // Default 500K VND for demo
      status: status || 'success',
      transactionId,
      responseCode,
      timestamp: new Date().toLocaleString('vi-VN'),
      bankCode: searchParams.get('vnp_BankCode') || 'NCB',
      cardType: searchParams.get('vnp_CardType') || 'ATM',
      contributorName: 'Người dùng hiện tại',
      paymentMethod: 'VNPay Sandbox'
    });
  }, [searchParams]);

  const formatCurrency = (amount: number) => {
    return mockDataService.formatCurrency(amount);
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Kết quả thanh toán
            </h1>
            <Heart className="h-8 w-8 text-red-500 animate-pulse" />
          </div>
          <p className="text-xl text-gray-600">Thông tin chi tiết về giao dịch góp quỹ của bạn</p>
        </div>

        {/* Status Alert */}
        <div className={`relative overflow-hidden rounded-2xl p-6 ${
          isSuccess 
            ? "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200" 
            : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
        }`}>
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              isSuccess ? "bg-green-100" : "bg-red-100"
            }`}>
              {isSuccess ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : (
                <XCircle className="h-8 w-8 text-red-600" />
              )}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${
                isSuccess ? "text-green-800" : "text-red-800"
              }`}>
                {isSuccess ? "🎉 Góp quỹ thành công!" : "❌ Góp quỹ thất bại"}
              </h3>
              <p className={`text-sm ${
                isSuccess ? "text-green-700" : "text-red-700"
              }`}>
                {isSuccess 
                  ? "Số tiền đã được cộng vào quỹ chung gia đình. Cảm ơn bạn đã đóng góp!" 
                  : "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại hoặc liên hệ hỗ trợ."
                }
              </p>
            </div>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-6 w-6" />
                Chi tiết giao dịch
              </CardTitle>
              <CardDescription className="text-blue-100">
                Thông tin chi tiết về giao dịch góp quỹ
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Mã giao dịch:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {paymentData.transactionId}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="text-sm font-medium text-gray-600">Số tiền:</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(paymentData.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Trạng thái:</span>
                  <Badge className={`${
                    isSuccess 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-red-100 text-red-800 border-red-200'
                  }`}>
                    {isSuccess ? 'Thành công' : 'Thất bại'}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Thời gian:</span>
                  <span className="text-sm font-medium">{paymentData.timestamp}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Ngân hàng:</span>
                  <span className="text-sm font-medium">{paymentData.bankCode}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600">Loại thẻ:</span>
                  <span className="text-sm font-medium">{paymentData.cardType}</span>
                </div>
              </div>

              {isSuccess && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800 mb-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-semibold">Giao dịch đã được xác thực</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Số tiền <span className="font-bold">{formatCurrency(paymentData.amount)}</span> đã được cộng vào quỹ chung gia đình.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fund Update Card */}
          {isSuccess && (
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-6 w-6" />
                  Cập nhật quỹ chung
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-sm font-medium text-gray-600">Số tiền góp:</span>
                    <span className="text-2xl font-bold text-green-600">
                      +{formatCurrency(paymentData.amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <span className="text-sm font-medium text-gray-600">Tổng quỹ hiện tại:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatCurrency(15750000 + paymentData.amount)}
                    </span>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-2 text-gray-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Cập nhật lúc {paymentData.timestamp}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span>Quỹ đang tăng</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-4 w-4 text-red-500" />
                      <span>Cảm ơn bạn!</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleBackToFundraising}
            className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            variant="outline"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại trang góp quỹ
          </Button>
          
          {isSuccess && (
            <Button 
              onClick={handleViewHistory}
              className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              <Gift className="h-5 w-5 mr-2" />
              Xem lịch sử góp quỹ
            </Button>
          )}
        </div>

        {/* Additional Information */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-white text-sm">
              <Sparkles className="h-5 w-5" />
              Thông tin bổ sung
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500">•</span>
                <p>Giao dịch được xử lý thông qua VNPay Sandbox (môi trường thử nghiệm)</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-500">•</span>
                <p>Tất cả số tiền và thông tin thanh toán đều là giả lập</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-purple-500">•</span>
                <p>Không có giao dịch thực tế nào được thực hiện</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-orange-500">•</span>
                <p>Để hỗ trợ, vui lòng liên hệ: <span className="font-semibold text-blue-600">support@familytree.com</span></p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 text-yellow-800">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">Demo Mode</span>
              </div>
              <p className="text-xs text-yellow-700 mt-1">
                Đây là phiên bản demo để trình diễn chức năng góp quỹ với VNPay Sandbox
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PaymentResult;


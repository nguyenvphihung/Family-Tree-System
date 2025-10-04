import React, { useState } from 'react';
import { DashboardLayout } from '../../components/layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { vnpayService } from '../../services/vnpayService';
import { 
  Wallet, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';

const Fundraising: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Mock data for fund status
  const fundData = {
    totalAmount: 15000000, // 15 triệu VND
    targetAmount: 50000000, // 50 triệu VND
    contributors: 127,
    lastContribution: {
      amount: 500000,
      contributor: "Nguyễn Văn A",
      time: "2 giờ trước"
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow numbers
    setAmount(value);
    setError('');
  };

  const handlePayment = async () => {
    if (!amount || parseInt(amount) < 10000) {
      setError('Số tiền tối thiểu là 10,000 VND');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const paymentAmount = parseInt(amount);
      const orderId = vnpayService.generateOrderId();
      
      // Generate VNPay payment URL
      const paymentResult = vnpayService.generatePaymentUrl({
        amount: paymentAmount,
        orderId: orderId,
        orderDescription: `Góp quỹ gia đình - ${vnpayService.formatCurrency(paymentAmount)}`,
        returnUrl: `${window.location.origin}/fundraising/payment-result`
      });

      if (paymentResult.success && paymentResult.paymentUrl) {
        // Redirect to VNPay payment page
        window.location.href = paymentResult.paymentUrl;
      } else {
        setError(paymentResult.error || 'Có lỗi xảy ra khi tạo URL thanh toán');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const progressPercentage = (fundData.totalAmount / fundData.targetAmount) * 100;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Quỹ Chung Gia Đình</h1>
          <p className="text-gray-600">Góp quỹ để duy trì và phát triển hệ thống cây gia phả</p>
        </div>

        {/* Fund Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng quỹ hiện tại</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(fundData.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Mục tiêu: {formatCurrency(fundData.targetAmount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số người góp</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fundData.contributors}</div>
              <p className="text-xs text-muted-foreground">
                Thành viên tích cực
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiến độ</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{progressPercentage.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Contribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contribution Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Góp quỹ ngay
              </CardTitle>
              <CardDescription>
                Nhập số tiền bạn muốn góp vào quỹ chung gia đình
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Số tiền góp (VND)
                </label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Nhập số tiền..."
                    value={amount}
                    onChange={handleAmountChange}
                    className="text-lg pr-12"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    VND
                  </span>
                </div>
                {amount && (
                  <p className="text-sm text-gray-600">
                    Bạn sẽ góp: <span className="font-semibold">{formatCurrency(parseInt(amount) || 0)}</span>
                  </p>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handlePayment}
                disabled={!amount || isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Thanh toán VNPay
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                <Shield className="h-3 w-3 inline mr-1" />
                Thanh toán an toàn với VNPay Sandbox
              </div>
            </CardContent>
          </Card>

          {/* Recent Contributions */}
          <Card>
            <CardHeader>
              <CardTitle>Góp quỹ gần đây</CardTitle>
              <CardDescription>
                Các thành viên đã góp quỹ gần đây
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">{fundData.lastContribution.contributor}</p>
                      <p className="text-sm text-gray-500">{fundData.lastContribution.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {formatCurrency(fundData.lastContribution.amount)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {[
                    { name: "Trần Thị B", amount: 200000, time: "5 giờ trước" },
                    { name: "Lê Văn C", amount: 1000000, time: "1 ngày trước" },
                    { name: "Phạm Thị D", amount: 300000, time: "2 ngày trước" },
                  ].map((contribution, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium">{contribution.name}</p>
                        <p className="text-xs text-gray-500">{contribution.time}</p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(contribution.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin về quỹ chung</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-green-600">Mục đích sử dụng quỹ:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Duy trì và nâng cấp hệ thống cây gia phả</li>
                  <li>• Tổ chức các sự kiện gia đình</li>
                  <li>• Lưu trữ và bảo quản tài liệu gia đình</li>
                  <li>• Hỗ trợ các thành viên trong gia đình</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-600">Quy trình thanh toán:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Nhập số tiền muốn góp</li>
                  <li>• Chuyển đến VNPay Sandbox</li>
                  <li>• Thanh toán bằng thẻ ảo</li>
                  <li>• Nhận xác nhận và cập nhật quỹ</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Fundraising;

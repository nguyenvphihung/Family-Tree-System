import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { vnpayService } from '../../services/vnpayService';
import { CreditCard, ExternalLink, CheckCircle } from 'lucide-react';

const FundraisingDemo: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGeneratePaymentUrl = async () => {
    setIsGenerating(true);
    setError('');
    setPaymentUrl('');

    try {
      const result = vnpayService.generatePaymentUrl({
        amount: 100000, // 100,000 VND
        orderId: vnpayService.generateOrderId(),
        orderDescription: 'Demo góp quỹ gia đình - 100,000 VND',
        returnUrl: `${window.location.origin}/fundraising/payment-result`
      });

      if (result.success && result.paymentUrl) {
        setPaymentUrl(result.paymentUrl);
      } else {
        setError(result.error || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tạo URL thanh toán');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestPayment = () => {
    if (paymentUrl) {
      window.open(paymentUrl, '_blank');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Demo VNPay Integration</h1>
        <p className="text-gray-600">Test chức năng thanh toán VNPay Sandbox</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configuration Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Trạng thái cấu hình
            </CardTitle>
            <CardDescription>
              Kiểm tra cấu hình VNPay Sandbox
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">TMN Code:</span>
                <span className="text-sm font-mono">
                  {vnpayService['TMN_CODE'] === 'YOUR_TMN_CODE' ? '❌ Chưa cấu hình' : '✅ Đã cấu hình'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Secret Key:</span>
                <span className="text-sm font-mono">
                  {vnpayService['SECRET_KEY'] === 'YOUR_SECRET_KEY' ? '❌ Chưa cấu hình' : '✅ Đã cấu hình'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Payment URL:</span>
                <span className="text-sm text-green-600">✅ Sandbox</span>
              </div>
            </div>
            
            {vnpayService['TMN_CODE'] === 'YOUR_TMN_CODE' && (
              <Alert>
                <AlertDescription>
                  Cần cấu hình TMN_CODE và SECRET_KEY trong file vnpayService.ts
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Test thanh toán
            </CardTitle>
            <CardDescription>
              Tạo URL thanh toán test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Số tiền test: <span className="font-semibold">100,000 VND</span>
              </p>
              <p className="text-sm text-gray-600">
                Mô tả: Demo góp quỹ gia đình
              </p>
            </div>

            <Button 
              onClick={handleGeneratePaymentUrl}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Đang tạo URL...' : 'Tạo URL thanh toán'}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {paymentUrl && (
              <div className="space-y-3">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    URL thanh toán đã được tạo thành công!
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Payment URL:</p>
                  <div className="p-2 bg-gray-100 rounded text-xs font-mono break-all">
                    {paymentUrl}
                  </div>
                </div>

                <Button 
                  onClick={handleTestPayment}
                  className="w-full"
                  variant="outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Mở trang thanh toán (Tab mới)
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Cards Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin thẻ test VNPay</CardTitle>
          <CardDescription>
            Sử dụng các thẻ này để test thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">Thẻ ATM nội địa</h4>
              <div className="text-sm space-y-1">
                <p><strong>Số thẻ:</strong> 9704198526191432198</p>
                <p><strong>Tên chủ thẻ:</strong> NGUYEN VAN A</p>
                <p><strong>Ngày phát hành:</strong> 07/15</p>
                <p><strong>Mã OTP:</strong> 123456</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Thẻ Visa</h4>
              <div className="text-sm space-y-1">
                <p><strong>Số thẻ:</strong> 4531234567890123</p>
                <p><strong>Tên chủ thẻ:</strong> NGUYEN VAN A</p>
                <p><strong>Ngày phát hành:</strong> 07/15</p>
                <p><strong>Mã OTP:</strong> 123456</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Cấu hình TMN_CODE và SECRET_KEY trong file vnpayService.ts</li>
            <li>Nhấn "Tạo URL thanh toán" để tạo link test</li>
            <li>Nhấn "Mở trang thanh toán" để chuyển đến VNPay Sandbox</li>
            <li>Sử dụng thông tin thẻ test ở trên để thanh toán</li>
            <li>Kiểm tra kết quả tại trang payment-result</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundraisingDemo;

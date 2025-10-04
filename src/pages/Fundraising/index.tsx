import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { vnpayService } from '../../services/vnpayService';
import { mockDataService, FundData, Contribution } from '../../services/mockDataService';
import { 
  Wallet, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Heart,
  Target,
  Clock,
  Gift,
  Star,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const Fundraising: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [fundData, setFundData] = useState<FundData | null>(null);
  const [recentContributions, setRecentContributions] = useState<Contribution[]>([]);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Load mock data
  useEffect(() => {
    const loadData = () => {
      setFundData(mockDataService.getFundData());
      setRecentContributions(mockDataService.getRecentContributions(5));
    };
    
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

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
      
      // Simulate VNPay payment process with mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add mock contribution
      const newContribution = mockDataService.addContribution({
        contributorName: 'Người dùng hiện tại',
        amount: paymentAmount,
        paymentMethod: 'VNPay'
      });
      
      // Update local state
      setFundData(mockDataService.getFundData());
      setRecentContributions(mockDataService.getRecentContributions(5));
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setAmount('');
      }, 3000);
      
      // In real implementation, redirect to VNPay
      // window.location.href = paymentResult.paymentUrl;
      
    } catch (err) {
      console.error('Payment error:', err);
      setError('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!fundData) {
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
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl p-8">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
          
          <div className="relative text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Quỹ Chung Gia Đình
              </h1>
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            </div>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Cùng nhau góp quỹ để duy trì và phát triển hệ thống cây gia phả, 
              lưu giữ những kỷ niệm quý báu của gia đình
            </p>
            
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Bảo mật tuyệt đối</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span>Thanh toán an toàn</span>
              </div>
              <div className="flex items-center space-x-1">
                <Gift className="h-4 w-4 text-purple-500" />
                <span>Minh bạch 100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Animation */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center space-y-4 animate-bounce">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold text-green-600">Góp quỹ thành công!</h3>
              <p className="text-gray-600">Cảm ơn bạn đã đóng góp vào quỹ chung gia đình</p>
            </div>
          </div>
        )}

        {/* Fund Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-green-700">Tổng quỹ hiện tại</CardTitle>
                  <div className="text-3xl font-bold text-green-600 mt-2">
                    {mockDataService.formatCurrency(fundData.totalAmount)}
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-green-600">
                Mục tiêu: {mockDataService.formatCurrency(fundData.targetAmount)}
              </p>
              <Progress 
                value={fundData.progressPercentage} 
                className="mt-3 h-2"
              />
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-blue-700">Số người góp</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">
                    {fundData.contributors}
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-blue-600">
                Thành viên tích cực
              </p>
              <div className="flex items-center mt-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600 ml-1">Cộng đồng đoàn kết</span>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-100 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-medium text-purple-700">Tiến độ</CardTitle>
                  <div className="text-3xl font-bold text-purple-600 mt-2">
                    {fundData.progressPercentage.toFixed(1)}%
                  </div>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-sm text-purple-600">
                Còn lại: {mockDataService.formatCurrency(fundData.targetAmount - fundData.totalAmount)}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600 ml-1">Đang tăng trưởng</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Contribution Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contribution Form */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Wallet className="h-6 w-6" />
                Góp quỹ ngay
              </CardTitle>
              <CardDescription className="text-green-100">
                Nhập số tiền bạn muốn góp vào quỹ chung gia đình
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                  Số tiền góp (VND)
                </label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="text"
                    placeholder="Nhập số tiền..."
                    value={amount}
                    onChange={handleAmountChange}
                    className="text-xl pr-16 h-14 border-2 border-gray-200 focus:border-green-500 rounded-xl"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                    VND
                  </span>
                </div>
                {amount && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">
                      Bạn sẽ góp: <span className="font-bold text-lg">{mockDataService.formatCurrency(parseInt(amount) || 0)}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Hoặc chọn nhanh:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[100000, 200000, 500000, 1000000, 2000000, 5000000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="text-xs hover:bg-green-50 hover:border-green-300"
                    >
                      {mockDataService.formatCurrency(quickAmount).replace('₫', 'K').replace('000', '')}
                    </Button>
                  ))}
                </div>
              </div>

              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handlePayment}
                disabled={!amount || isProcessing}
                className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-lg font-semibold rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 disabled:scale-100 disabled:opacity-50"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Đang xử lý thanh toán...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-3" />
                    Thanh toán VNPay
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Shield className="h-3 w-3 text-green-500" />
                  <span>Bảo mật SSL</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>VNPay Sandbox</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-purple-500" />
                  <span>Demo Mode</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Contributions */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-6 w-6" />
                Góp quỹ gần đây
              </CardTitle>
              <CardDescription className="text-blue-100">
                Các thành viên đã góp quỹ gần đây
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {recentContributions.length > 0 ? (
                  recentContributions.map((contribution, index) => (
                    <div 
                      key={contribution.id} 
                      className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
                        index === 0 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {index === 0 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Heart className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{contribution.contributorName}</p>
                          <p className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {mockDataService.formatDate(contribution.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            index === 0 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          } font-semibold`}
                        >
                          {mockDataService.formatCurrency(contribution.amount)}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {contribution.paymentMethod}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Chưa có góp quỹ nào gần đây</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <Target className="h-6 w-6" />
                Mục đích sử dụng quỹ
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { icon: '🌳', title: 'Duy trì hệ thống', desc: 'Nâng cấp và bảo trì hệ thống cây gia phả' },
                  { icon: '🎉', title: 'Sự kiện gia đình', desc: 'Tổ chức các hoạt động và lễ hội gia đình' },
                  { icon: '📚', title: 'Lưu trữ tài liệu', desc: 'Bảo quản và số hóa tài liệu gia đình' },
                  { icon: '🤝', title: 'Hỗ trợ thành viên', desc: 'Giúp đỡ các thành viên trong gia đình' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-purple-50 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-6 w-6" />
                Quy trình thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Nhập số tiền', desc: 'Chọn số tiền muốn góp vào quỹ chung' },
                  { step: '2', title: 'Chuyển VNPay', desc: 'Được chuyển đến trang thanh toán VNPay Sandbox' },
                  { step: '3', title: 'Thanh toán', desc: 'Sử dụng thẻ test để thanh toán ảo' },
                  { step: '4', title: 'Xác nhận', desc: 'Nhận kết quả và cập nhật vào quỹ chung' }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <div className="flex items-center space-x-2 text-yellow-800">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold">Demo Mode</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1">
                  Tất cả giao dịch đều là ảo, không có tiền thật được chuyển
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Fundraising;

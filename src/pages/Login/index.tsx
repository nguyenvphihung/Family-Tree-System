import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  UserCheck,
  Phone,
  Lock,
  TreePine,
  Shield,
  Users,
  Sparkles,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { LoginCredentials } from "@/types";
import { authService } from "@/services";

const Login = () => {
  const navigate = useNavigate();

  // States
  const [formData, setFormData] = useState<LoginCredentials>({
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Input handler
  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Client-side validation
  const validateForm = (): string | null => {
    if (!formData.phone || !formData.password) {
      return "Vui lòng điền đầy đủ thông tin";
    }

    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!phoneRegex.test(formData.phone)) {
      return "Số điện thoại không đúng định dạng";
    }

    return null;
  };

  // Submit handler với nhiều debug hơn
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 BẮT ĐẦU LOGIN PROCESS');
      console.log('📋 Form data:', formData);

      // Debug localStorage trước khi login
      console.log('📱 LocalStorage TRƯỚC login:');
      authService.debugLocalStorage();

      // GỌI SERVICE
      const result = await authService.login(formData, rememberMe);

      console.log('📨 Kết quả từ authService.login:', result);

      if (result.success) {
        console.log('✅ Login service trả về success');

        // Debug localStorage sau khi login
        console.log('📱 LocalStorage SAU login:');
        authService.debugLocalStorage();

        // Kiểm tra token có thực sự được lưu không
        const savedToken = authService.getToken();
        const isAuth = authService.isAuthenticated();

        console.log('🔍 Kiểm tra cuối cùng:', {
          savedToken: !!savedToken,
          isAuthenticated: isAuth
        });

        setSuccess(true);
        setTimeout(() => {
          navigate("/dashboard", { replace: true });
        }, 2000);
      } else {
        console.log('❌ Login service trả về fail:', result.message);
        setError(result.message);
      }
    } catch (error: any) {
      console.error('💥 Exception trong handleSubmit:', error);
      setError(error.message || "Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  // Check already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center p-4 relative z-10 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    Family Tree System
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Quản lý cây gia phả hiện đại
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                  Chào mừng trở lại!
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {" "}
                    Đăng nhập ngay
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Tiếp tục hành trình lưu giữ và chia sẻ những kỷ niệm quý báu của
                  gia đình. Truy cập vào cây gia phả và kết nối với những người
                  thân yêu.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">Bảo mật thông tin tuyệt đối</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700">Kết nối gia đình dễ dàng</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="text-gray-700">Trải nghiệm tuyệt vời</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
              <p className="text-sm text-gray-600 mb-2">Chưa có tài khoản?</p>
              <Link
                to="/register"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Tạo tài khoản ngay
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 text-center pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold">Đăng nhập</CardTitle>
                <CardDescription className="text-base">
                  Nhập thông tin để truy cập tài khoản
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="border-emerald-200 bg-emerald-50">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <AlertDescription className="text-emerald-800">
                      Đăng nhập thành công! Đang chuyển hướng...
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Số điện thoại
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Mật khẩu
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10 h-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <Label htmlFor="rememberMe" className="text-sm text-gray-600">
                      Ghi nhớ đăng nhập
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || success}
                    className="w-full h-11 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang đăng nhập...</span>
                      </div>
                    ) : success ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Đăng nhập thành công!</span>
                      </div>
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </form>

                {/* Navigation */}
                <div className="space-y-4 pt-2">
                  <div className="text-center">
                    <Link to="/forgot-password" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="text-center lg:hidden">
                    <p className="text-sm text-gray-600 mb-2">Chưa có tài khoản?</p>
                    <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">
                      Tạo tài khoản ngay
                    </Link>
                  </div>

                  <Link
                    to="/"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 hover:border-emerald-300 rounded-lg text-gray-700 hover:text-emerald-600 font-medium transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay về trang chủ
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Response Area */}
      <div id="response-area" style={{ display: 'none' }} className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md bg-white border"></div>
    </div>
  );
};

export default Login;

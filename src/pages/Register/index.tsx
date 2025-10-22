import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  EyeOff,
  Users,
  Mail,
  Lock,
  User,
  TreePine,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  Phone,
} from "lucide-react";
import { RegisterCredentials } from "@/types";
import { authService } from "@/services";

const Register = () => {
  // State cho form đăng ký mới sử dụng RegisterCredentials
  const [formData, setFormData] = useState<RegisterCredentials>({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  // Hàm validate dữ liệu form, trả về chuỗi lỗi hoặc null nếu hợp lệ
  const validateForm = (data: RegisterCredentials): string | null => {
    const name = (data.name || "").trim();
    const phone = (data.phone || "").trim();
    const email = (data.email || "").trim();
    const password = data.password || "";
    const confirmPassword = data.confirmPassword || "";

    if (!name || !phone || !email || !password || !confirmPassword) {
      return "Vui lòng điền đầy đủ thông tin";
    }

    if (name.length < 2) {
      return "Họ và tên phải có ít nhất 2 ký tự";
    }

    // Chỉ chấp nhận đúng 10 chữ số
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải gồm đúng 10 chữ số";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không đúng định dạng";
    }

    if (password.length < 6) {
      return "Mật khẩu cần tối thiểu 6 ký tự";
    }

    if (password !== confirmPassword) {
      return "Mật khẩu không khớp";
    }

    return null;
  };

  // Hàm xử lý thay đổi input
  const handleInputChange = (field: keyof RegisterCredentials, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Hàm submit form sử dụng API thực tế
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Chuẩn hóa và validate
    const trimmed = {
      ...formData,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim()
    };
    const validationError = validateForm(trimmed);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      console.log("Đang gửi dữ liệu đăng ký:", formData);

      const response = await authService.register(trimmed);

      console.log("Phản hồi từ server:", response);

      if (response.success || /thành công/i.test(response.message || "")) {
        console.log("Đăng ký thành công:", response.message);
        setSuccess(true);
        setError(""); // Clear any previous errors
        setShowSuccessModal(true);

        // Tự động chuyển về trang đăng nhập sau 10 giây
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 15000);
      } else {
        // Nếu API trả về thông điệp dạng 'thành công' nhưng success=false, vẫn coi là success
        if (/thành công/i.test(response.message || "")) {
          setSuccess(true);
          setError("");
          setShowSuccessModal(true);
        } else {
          setError(response.message || "Đăng ký thất bại");
        }
      }
    } catch (error: any) {
      console.error("Lỗi đăng ký:", error);
      setError(error.message || "Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full px-4 py-6">
        <div className="w-full max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left Panel - Welcome Section */}
          <div className="hidden lg:flex flex-col justify-center space-y-8 p-8 mb-[30px]">
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
                  Tạo tài khoản mới và
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {" "}
                    bắt đầu hành trình
                  </span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Tham gia cộng đồng để lưu giữ và chia sẻ những kỷ niệm quý báu
                  của gia đình bạn. Xây dựng cây gia phả hoàn chỉnh và kết nối với
                  những người thân yêu.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-gray-700">
                    Quản lý thông tin gia đình dễ dàng
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="text-gray-700">
                    Giao diện hiện đại và thân thiện
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-cyan-600" />
                  </div>
                  <span className="text-gray-700">
                    Bảo mật thông tin tuyệt đối
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
              <p className="text-sm text-gray-600 mb-2">Đã có tài khoản?</p>
              <Link
                to="/login"
                className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
              >
                Đăng nhập ngay
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

          {/* Right Panel - Register Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 mb-[30px]">
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl mb-[30px]">
              <CardHeader className="space-y-2 text-center">
                <CardTitle className="text-2xl font-bold">Tạo tài khoản</CardTitle>
                <CardDescription>
                  Nhập thông tin để tạo tài khoản mới
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {success && !showSuccessModal ? (
                  <div className="w-full rounded-lg border border-emerald-400 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    <p className="font-semibold">Đăng ký tài khoản thành công</p>
                  </div>
                ) : (
                  error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Họ tên */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Nhập họ và tên"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Số điện thoại */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={(e) => {
                          // Chỉ cho phép số và tối đa 10 ký tự
                          const digitsOnly = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                          handleInputChange('phone', digitsOnly);
                        }}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Mật khẩu */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Xác nhận mật khẩu */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full transition-all duration-300 ${success
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                      }`}
                    disabled={isLoading || success}
                  >
                    {success ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4" />
                        <span>Đăng ký thành công!</span>
                      </div>
                    ) : isLoading ? (
                      "Đang đăng ký..."
                    ) : (
                      "Tạo tài khoản"
                    )}
                  </Button>
                </form>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">
                    Đã có tài khoản?{" "}
                  </span>
                  <Link
                    to="/login"
                    className="text-emerald-600 hover:text-emerald-500 font-medium"
                  >
                    Đăng nhập ngay
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Response Area để hiển thị thông báo từ makeRequest */}
      <div id="response-area" style={{ display: 'none' }} className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg max-w-md">
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-800">
              🎉 Đăng ký thành công!
            </DialogTitle>
            <DialogDescription className="text-green-700 text-lg mt-2">
              Bạn đã tạo tài khoản thành công trong hệ thống Family Tree System.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-800 font-medium">Tài khoản đã được tạo</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-800 font-medium">Thông tin đã được lưu trữ</span>
              </div>
              <div className="flex items-center space-x-3 mt-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <span className="text-green-800 font-medium">Sẵn sàng đăng nhập</span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Bạn sẽ được chuyển hướng đến trang đăng nhập sau ít giây...
              </p>
              <Button
                onClick={() => navigate("/login", { replace: true })}
                className="mt-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                Đăng nhập ngay
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
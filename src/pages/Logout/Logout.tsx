import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/services/authService";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TreePine, LogOut, Shield, Users, Sparkles, CheckCircle, AlertCircle } from "lucide-react";

const Logout = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [logoutStatus, setLogoutStatus] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    useEffect(() => {
        const handleLogout = async () => {
            try {
                console.log('🚀 Bắt đầu process đăng xuất...');

                // Gọi authService logout
                const result = await authService.logout();

                console.log('📋 Kết quả logout:', result);
                setLogoutStatus(result);

                if (result.success) {
                    console.log('✅ Logout thành công:', result.message);

                    // Chờ 2 giây để user thấy thông báo thành công
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 2000);
                } else {
                    console.log(' Logout có lỗi:', result.message);

                    // Vẫn chuyển về login sau 3 giây dù có lỗi
                    setTimeout(() => {
                        navigate('/login', { replace: true });
                    }, 3000);
                }
            } catch (error: any) {
                console.error('💥 Exception trong logout process:', error);

                // Fallback: vẫn chuyển về login
                setLogoutStatus({
                    success: false,
                    message: 'Có lỗi xảy ra nhưng đã đăng xuất'
                });

                setTimeout(() => {
                    navigate('/login', { replace: true });
                }, 3000);
            } finally {
                setIsLoading(false);
            }
        };

        handleLogout();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl"></div>
            </div>

            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
                {/* Left Panel - Brand Section */}
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
                                Hẹn gặp lại bạn
                                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                                    {" "}sau nhé!
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                Phiên đăng nhập của bạn đang được kết thúc an toàn. Cảm ơn bạn đã
                                tin dùng hệ thống.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-emerald-600" />
                                </div>
                                <span className="text-gray-700">Đăng xuất bảo mật, xóa token an toàn</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                    <Users className="w-4 h-4 text-teal-600" />
                                </div>
                                <span className="text-gray-700">Bạn có thể đăng nhập bằng tài khoản khác</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-cyan-600" />
                                </div>
                                <span className="text-gray-700">Dữ liệu của bạn luôn được bảo vệ</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Logout Card */}
                <div className="flex items-center justify-center">
                    <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-2 text-center pb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg ${logoutStatus?.success
                                    ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                                    : logoutStatus?.success === false
                                        ? 'bg-gradient-to-br from-red-500 to-red-600'
                                        : 'bg-gradient-to-br from-emerald-500 to-teal-600'
                                }`}>
                                {isLoading ? (
                                    <LogOut className="w-8 h-8 text-white" />
                                ) : logoutStatus?.success ? (
                                    <CheckCircle className="w-8 h-8 text-white" />
                                ) : (
                                    <AlertCircle className="w-8 h-8 text-white" />
                                )}
                            </div>

                            <CardTitle className="text-2xl font-bold">
                                {isLoading
                                    ? 'Đang đăng xuất'
                                    : logoutStatus?.success
                                        ? 'Đăng xuất thành công'
                                        : 'Đăng xuất hoàn tất'
                                }
                            </CardTitle>

                            <CardDescription className="text-base">
                                {isLoading
                                    ? 'Vui lòng đợi trong giây lát...'
                                    : logoutStatus?.success
                                        ? 'Đang chuyển hướng về trang đăng nhập...'
                                        : 'Sẽ chuyển về trang đăng nhập ngay...'
                                }
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col items-center space-y-4 py-2">
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <div className={`text-sm text-center px-4 py-2 rounded-lg ${logoutStatus?.success
                                            ? 'bg-green-50 text-green-800 border border-green-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                        }`}>
                                        {logoutStatus?.message}
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 text-center">
                                    {isLoading
                                        ? 'Bạn sẽ được chuyển về trang đăng nhập ngay sau khi hoàn tất.'
                                        : logoutStatus?.success
                                            ? 'Chuyển hướng sau 2 giây...'
                                            : 'Chuyển hướng sau 3 giây...'
                                    }
                                </p>

                                <Button asChild variant="ghost" className="text-emerald-600 hover:text-emerald-700">
                                    <Link to="/login">Quay lại trang đăng nhập ngay</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Logout;
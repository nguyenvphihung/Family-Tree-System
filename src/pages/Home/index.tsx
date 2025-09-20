import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  TreePine,
  Users,
  Heart,
  Camera,
  FileText,
  Calendar,
  BookOpen,
  Sparkles,
  ArrowRight,
  Shield,
  Globe,
  Star,
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: TreePine,
      title: "Cây Gia Phả",
      description: "Xây dựng và quản lý cây gia phả của gia đình bạn một cách trực quan và dễ dàng",
    },
    {
      icon: Users,
      title: "Quản Lý Thành Viên",
      description: "Lưu trữ thông tin chi tiết về từng thành viên trong gia đình",
    },
    {
      icon: Camera,
      title: "Album Ảnh",
      description: "Lưu giữ và chia sẻ những khoảnh khắc đẹp của gia đình",
    },
    {
      icon: FileText,
      title: "Tài Liệu",
      description: "Lưu trữ các giấy tờ quan trọng và tài liệu gia đình",
    },
    {
      icon: Calendar,
      title: "Sự Kiện",
      description: "Ghi nhớ và tổ chức các sự kiện quan trọng của gia đình",
    },
    {
      icon: BookOpen,
      title: "Câu Chuyện",
      description: "Viết và chia sẻ những câu chuyện, kỷ niệm đáng nhớ",
    },
  ];

  const sidebarSuggestions = [
    { icon: TreePine, label: "Xem cây gia phả", path: "/family-tree-demo" },
    { icon: Users, label: "Danh sách thành viên", path: "/members" },
    { icon: Camera, label: "Album ảnh gia đình", path: "/photos" },
    { icon: FileText, label: "Tài liệu quan trọng", path: "/documents" },
    { icon: Calendar, label: "Sự kiện gia đình", path: "/events" },
    { icon: BookOpen, label: "Câu chuyện gia đình", path: "/stories" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-teal-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-200/10 to-teal-200/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
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

          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost" className="text-gray-600 hover:text-emerald-600">
                Giới thiệu
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                Đăng nhập
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg">
                Đăng ký ngay
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Lưu giữ và chia sẻ
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {" "}
                  cây gia phả
                </span>
                <br />
                của gia đình bạn
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Khám phá, xây dựng và quản lý cây gia phả một cách hiện đại. 
                Lưu giữ những kỷ niệm quý báu và kết nối với những người thân yêu 
                trong một không gian số đầy ý nghĩa.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Khám phá ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/family-tree-demo">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-lg px-8 py-6"
                >
                  <TreePine className="w-5 h-5 mr-2" />
                  Xem Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-6 py-1">
          <div className="text-center mb-3">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Tính năng nổi bật
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Khám phá những công cụ mạnh mẽ giúp bạn quản lý thông tin gia đình một cách hiệu quả
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sidebar Suggestions */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-8">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Khám phá thêm
              </h3>
              <p className="text-lg text-gray-600">
                Dưới đây là những tính năng bạn có thể khám phá sau khi đăng ký
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sidebarSuggestions.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="group flex items-center p-6 bg-white/40 hover:bg-white/60 border border-white/30 hover:border-white/50 rounded-xl transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-4 shadow-md group-hover:shadow-lg transition-all duration-300">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium group-hover:text-emerald-600 transition-colors">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Những lợi ích vượt trội khi sử dụng hệ thống quản lý gia phả của chúng tôi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white/40 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Bảo mật tuyệt đối
              </h4>
              <p className="text-gray-600">
                Thông tin gia đình của bạn được mã hóa và bảo vệ an toàn với công nghệ tiên tiến nhất
              </p>
            </div>

            <div className="text-center p-8 bg-white/40 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Truy cập mọi lúc mọi nơi
              </h4>
              <p className="text-gray-600">
                Đồng bộ dữ liệu trên tất cả thiết bị, truy cập thông tin gia đình từ bất kỳ đâu
              </p>
            </div>

            <div className="text-center p-8 bg-white/40 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Giao diện thân thiện
              </h4>
              <p className="text-gray-600">
                Thiết kế hiện đại, dễ sử dụng cho mọi lứa tuổi, từ trẻ em đến người cao tuổi
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl shadow-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6">
                Sẵn sàng bắt đầu hành trình?
              </h3>
              <p className="text-xl mb-8 opacity-90">
                Tham gia cùng hàng nghìn gia đình đang sử dụng hệ thống của chúng tôi
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button 
                    size="lg" 
                    className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Đăng ký miễn phí
                  </Button>
                </Link>
                <Link to="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                  >
                    Đăng nhập
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/40 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <TreePine className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Family Tree System</h4>
                <p className="text-sm text-gray-600">Quản lý gia phả hiện đại</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Link to="/about" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Giới thiệu
              </Link>
              <Link to="/family-tree-demo" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Demo
              </Link>
              <Link to="/login" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Đăng nhập
              </Link>
              <Link to="/register" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Đăng ký
              </Link>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-gray-600">
              © 2024 Family Tree System. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;


